import { prisma } from "../lib/db.js";

interface InputDto {
  userId: string;
  weightInGrams: number;
  heightInCentimeters: number;
  age: number;
  bodyFatPercentage: number;
  goal?: string;
  workoutTimeExperience?: string; //tempo de treino em anos
  workoutFrequency?: number; //frequencia de treino de 1 a 7 dias
  workoutType?: string;
}

interface OutputDto {
  userId: string;
  weightInGrams: number;
  heightInCentimeters: number;
  age: number;
  bodyFatPercentage: number;
  goal?: string;
  workoutTimeExperience?: string; //tempo de treino em anos
  workoutFrequency?: number; //frequencia de treino de 1 a 7 dias
  workoutType?: string;
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
      goal: user.goal ?? undefined,
      workoutTimeExperience: user.workoutTimeExperience ?? undefined,
      workoutFrequency: user.workoutFrequency ?? undefined,
      workoutType: user.workoutType ?? undefined,
    };
  }
}
