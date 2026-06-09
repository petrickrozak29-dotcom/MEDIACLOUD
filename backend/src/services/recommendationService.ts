import { PrismaClient } from '@prisma/client';
import { getUserLocation, haversineDistance } from './locationService';
import OpenAI from 'openai';

const prisma = new PrismaClient();

// OpenAI client - optional
let openai: OpenAI | null = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

interface ScoredDestination {
  destination: any;
  score: number;
  distance: number;
  reason: string;
  estimatedTravelTime: number;
  breakdown: {
    distanceScore: number;
    categoryRelevance: number;
    ratingScore: number;
    budgetScore: number;
    accessibilityScore: number;
  };
}

interface ItineraryItem {
  order: number;
  destination: any;
  startTime: Date;
  endTime: Date;
  stayDuration: number; // minutes
  travelTime: number; // minutes
  estimatedCost: number;
  notes: string;
  directions: string;
}

interface ItineraryResult {
  itinerary: ItineraryItem[];
  totalDistance: number;
  totalCost: number;
  totalDuration: number;
  summary: string;
  tips: string[];
}

// Calculate max distance based on mobility level
function calculateMaxDistance(mobilityLevel: number): number {
  // mobilityLevel 1-10, returns distance in km
  return 5 + (mobilityLevel * 2); // Range: 7-25 km
}

export async function scoreDestinations(
  userId: string,
  maxResults: number = 10
): Promise<ScoredDestination[]> {
  // Get user location
  const userLocation = await getUserLocation(userId);

  // Get user preferences
  const preferences = await prisma.userPreferences.findUnique({
    where: { userId }
  });

  if (!preferences) {
    throw new Error('User preferences not found');
  }

  // Get all tourism destinations
  const destinations = await prisma.tourism.findMany();

  const maxDistance = preferences.distancePreference || calculateMaxDistance(preferences.mobilityLevel);

  // Score each destination
  const scored: ScoredDestination[] = destinations
    .map(dest => {
      // Calculate distance
      const distance = haversineDistance(
        userLocation.latitude,
        userLocation.longitude,
        dest.latitude,
        dest.longitude
      );

      // Skip if too far
      if (distance > maxDistance) {
        return null;
      }

      // Distance score (0-30): closer = higher
      const distanceScore = 30 * (1 - distance / maxDistance);

      // Category relevance (0-35)
      let categoryRelevance = 0;
      if (preferences.interests.includes(dest.category.toLowerCase())) {
        categoryRelevance = 35;
      }

      // Rating score (0-20) - assume rating 4.5/5 for now
      const rating = 4.5;
      const ratingScore = (rating / 5) * 20;

      // Budget score (0-15)
      let budgetScore = 15;
      if (preferences.budgetLevel === 'budget') {
        budgetScore = 12;
      } else if (preferences.budgetLevel === 'premium') {
        budgetScore = 15;
      }

      // Accessibility score (0-10) based on mobility level
      const accessibilityScore = Math.min(10, preferences.mobilityLevel);

      // Total score
      const totalScore = distanceScore + categoryRelevance + ratingScore + budgetScore + accessibilityScore;

      // Estimate travel time (40 km/h average)
      const estimatedTravelTime = Math.ceil((distance / 40) * 60);

      // Generate reason
      let reason = `${distance.toFixed(1)} km away`;
      if (categoryRelevance > 0) {
        reason += `, matches your interest in ${dest.category}`;
      }

      return {
        destination: dest,
        score: Math.round(totalScore * 100) / 100,
        distance,
        reason,
        estimatedTravelTime,
        breakdown: {
          distanceScore: Math.round(distanceScore * 100) / 100,
          categoryRelevance,
          ratingScore: Math.round(ratingScore * 100) / 100,
          budgetScore,
          accessibilityScore
        }
      };
    })
    .filter((item): item is ScoredDestination => item !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);

  return scored;
}

export async function generateItinerary(
  userId: string,
  params: {
    duration: number; // hours
    startTime: Date;
    interests: string[];
    budget: number;
  }
): Promise<ItineraryResult> {
  const { duration, startTime, interests, budget } = params;

  // Validate inputs
  if (duration <= 0) {
    throw new Error('Duration must be greater than 0');
  }
  if (budget < 0) {
    throw new Error('Budget must be non-negative');
  }
  if (interests.length === 0) {
    throw new Error('At least one interest must be specified');
  }

  // Get scored recommendations
  const recommendations = await scoreDestinations(userId, 20);

  if (recommendations.length === 0) {
    throw new Error('No destinations found matching your criteria');
  }

  // Greedy algorithm to build itinerary
  const itinerary: ItineraryItem[] = [];
  let currentTime = new Date(startTime);
  let remainingTime = duration * 60; // convert to minutes
  let remainingBudget = budget;
  let totalDistance = 0;

  for (const rec of recommendations) {
    // Skip if less than 30 min remaining
    if (remainingTime < 30) break;

    const travelTime = rec.estimatedTravelTime;
    const stayTime = Math.min(120, remainingTime - travelTime); // max 2 hours per destination
    const totalTime = travelTime + stayTime;

    // Check time fit
    if (totalTime > remainingTime) continue;

    // Estimate cost (50,000 IDR per destination + transport)
    const estimatedCost = 50000 + (travelTime / 60) * 20000;

    // Check budget fit
    if (estimatedCost > remainingBudget) continue;

    // Add to itinerary
    const endTime = new Date(currentTime.getTime() + totalTime * 60000);

    itinerary.push({
      order: itinerary.length + 1,
      destination: rec.destination,
      startTime: new Date(currentTime),
      endTime,
      stayDuration: stayTime,
      travelTime,
      estimatedCost,
      notes: `Bring water and comfortable shoes`,
      directions: `${rec.distance.toFixed(1)} km from current location`
    });

    // Update state
    currentTime = endTime;
    remainingTime -= totalTime;
    remainingBudget -= estimatedCost;
    totalDistance += rec.distance;

    // Stop if we have enough destinations
    if (itinerary.length >= 6) break;
  }

  // Ensure minimum 2 destinations
  if (itinerary.length < 2 && recommendations.length >= 2) {
    // Try to add one more with relaxed constraints
    for (const rec of recommendations) {
      if (itinerary.find(item => item.destination.id === rec.destination.id)) continue;
      
      if (remainingTime >= 30) {
        const endTime = new Date(currentTime.getTime() + 30 * 60000);
        itinerary.push({
          order: itinerary.length + 1,
          destination: rec.destination,
          startTime: new Date(currentTime),
          endTime,
          stayDuration: 30,
          travelTime: rec.estimatedTravelTime,
          estimatedCost: 30000,
          notes: 'Quick visit',
          directions: `${rec.distance.toFixed(1)} km from previous location`
        });
        break;
      }
    }
  }

  const totalCost = itinerary.reduce((sum, item) => sum + item.estimatedCost, 0);
  const totalDuration = itinerary.reduce((sum, item) => sum + item.stayDuration + item.travelTime, 0);

  // Generate AI summary
  let summary = '';
  let tips: string[] = [];

  try {
    if (openai) {
      const prompt = `Generate a friendly itinerary summary for a ${duration}-hour trip to Magelang with ${itinerary.length} destinations. Budget: ${budget} IDR. Interests: ${interests.join(', ')}. Keep it concise (max 100 words).`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 150,
        temperature: 0.7
      });

      summary = completion.choices[0]?.message?.content || 'Enjoy your trip to Magelang!';
      tips = [
        'Start early to avoid crowds',
        'Bring cash for small vendors',
        'Try local cuisine at each stop'
      ];
    } else {
      // Fallback if OpenAI not available
      summary = `Your ${duration}-hour itinerary includes ${itinerary.length} amazing destinations in Magelang. Total distance: ${totalDistance.toFixed(1)} km. Enjoy exploring local culture, nature, and delicious food!`;
      tips = ['Bring water and snacks', 'Wear comfortable shoes', 'Check weather forecast', 'Start early for best experience'];
    }
  } catch (error) {
    // Fallback if OpenAI fails
    summary = `Your ${duration}-hour itinerary includes ${itinerary.length} amazing destinations in Magelang. Total distance: ${totalDistance.toFixed(1)} km. Enjoy exploring!`;
    tips = ['Bring water and snacks', 'Wear comfortable shoes', 'Check weather forecast'];
  }

  // Save itinerary
  await prisma.savedItinerary.create({
    data: {
      userId,
      title: `Magelang Trip - ${startTime.toLocaleDateString()}`,
      description: summary,
      items: JSON.stringify(itinerary),
      duration: totalDuration,
      totalDistance,
      totalEstimatedCost: totalCost
    }
  });

  return {
    itinerary,
    totalDistance,
    totalCost,
    totalDuration,
    summary,
    tips
  };
}

export async function getDestinationInsights(destinationId: string): Promise<any> {
  const destination = await prisma.tourism.findUnique({
    where: { id: destinationId }
  });

  if (!destination) {
    throw new Error('Destination not found');
  }

  try {
    if (openai) {
      const prompt = `Provide travel tips for ${destination.name} in Magelang, Indonesia. Include: best time to visit, local recommendations, and estimated visit time. Keep it brief.`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
        temperature: 0.7
      });

      const aiResponse = completion.choices[0]?.message?.content || '';

      return {
        destinationId,
        tips: ['Arrive early to avoid crowds', 'Parking available', 'Local guide recommended'],
        bestTimeToVisit: 'Tuesday-Thursday mornings, 8-11 AM',
        localRecommendations: ['Try local specialty nearby', 'Don\'t miss sunset view'],
        historicalInfo: aiResponse,
        estimatedVisitTime: 120
      };
    } else {
      // Fallback without OpenAI
      return {
        destinationId,
        tips: ['Arrive early to avoid crowds', 'Parking available', 'Local guide recommended', 'Bring water and sunscreen'],
        bestTimeToVisit: 'Weekday mornings (8-11 AM) for best experience',
        localRecommendations: ['Explore nearby areas', 'Try local cuisine', 'Ask locals for hidden gems'],
        historicalInfo: destination.description,
        estimatedVisitTime: 90
      };
    }
  } catch (error) {
    // Fallback
    return {
      destinationId,
      tips: ['Plan ahead', 'Bring camera', 'Respect local customs'],
      bestTimeToVisit: 'Weekday mornings',
      localRecommendations: ['Explore nearby areas'],
      historicalInfo: destination.description,
      estimatedVisitTime: 90
    };
  }
}
