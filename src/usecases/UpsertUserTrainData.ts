import { prisma } from "../lib/db.js";

interface InputDto {
  userId: string;
  weightInGrams: number;
  heightInCentimeters: number;
  age: number;
  bodyFatPercentage: number;
  goal: string | null;
  workoutTimeExperience: number | null; //tempo de treino em anos
  workoutFrequency: number | null; //frequencia de treino de 1 a 7 dias
  workoutType: string | null;
}

interface OutputDto {
  userId: string;
  weightInGrams: number;
  heightInCentimeters: number;
  age: number;
  bodyFatPercentage: number;
  goal: string | null;
  workoutTimeExperience: number | null; //tempo de treino em anos
  workoutFrequency: number | null; //frequencia de treino de 1 a 7 dias
  workoutType: string | null;
}

export class UpsertUserTrainData {
  async execute(dto: InputDto): Promise<OutputDto> {
    const user = await prisma.user.update({
      where: { id: dto.userId },
      data: {
        weightInGrams: dto.weightInGrams,
        heightInCentimeters: dto.heightInCentimeters,
        age: dto.age,
        bodyFatPercentage: dto.bodyFatPercentage,
        goal: dto.goal,
        workoutTimeExperience: dto.workoutTimeExperience,
        workoutFrequency: dto.workoutFrequency,
        workoutType: dto.workoutType,
      },
    });

    return {
      userId: user.id,
      weightInGrams: user.weightInGrams!,
      heightInCentimeters: user.heightInCentimeters!,
      age: user.age!,
      bodyFatPercentage: user.bodyFatPercentage!,
      goal: user.goal,
      workoutTimeExperience: user.workoutTimeExperience,
      workoutFrequency: user.workoutFrequency,
      workoutType: user.workoutType,
    };
  }
}
