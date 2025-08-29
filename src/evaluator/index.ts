import { EvaluationResult, RepositoryInfo, RepositoryScore } from '../types';
import { evaluationCriteria, calculateRating, generateRecommendations } from './criteria';

export class RepositoryEvaluator {
  async evaluate(repository: RepositoryInfo): Promise<RepositoryScore> {
    const results: EvaluationResult[] = [];
    
    for (const criteria of evaluationCriteria) {
      const passed = await criteria.check(repository);
      results.push({
        criteria: criteria.name,
        passed,
        weight: criteria.weight,
        description: criteria.description,
      });
    }

    const totalScore = results.reduce((sum, result) => sum + (result.passed ? result.weight : 0), 0);
    const maxScore = results.reduce((sum, result) => sum + result.weight, 0);
    const percentage = Math.round((totalScore / maxScore) * 100);
    const rating = calculateRating(percentage);
    const recommendations = generateRecommendations(results);

    return {
      repository,
      results,
      totalScore,
      maxScore,
      percentage,
      rating,
      recommendations,
    };
  }
}