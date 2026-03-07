import { prisma } from "../lib/db.js";

interface InputDto {
  userId: string;
}

interface OutputDto {
  userId: string;
  userName: string;
  weightInGrams: number;
  heightInCentimeters: number;
  age: number;
  bodyFatPercentage: number;
  goal?: string;
  workoutTimeExperience?: string; //tempo de treino em anos
  workoutFrequency?: number; //frequencia de treino de 1 a 7 dias
  workoutType?: string;
  isPersonal: boolean | false;
  personalUserId: string | null;
  personalWorkoutPlanId: string | null;
  personalStartDate: string | null; //salva somente a data
  personalFinishDate: string | null;
}

export class GetUserTrainData {
  async execute(dto: InputDto): Promise<OutputDto | null> {
    const user = await prisma.user.findUnique({
      where: { id: dto.userId },
    });

    if (!user) {
      return null;
    }

    if (
      user.weightInGrams === null ||
      user.heightInCentimeters === null ||
      user.age === null ||
      user.bodyFatPercentage === null
    ) {
      return null;
    }

    return {
      userId: user.id,
      userName: user.name,
      weightInGrams: user.weightInGrams,
      heightInCentimeters: user.heightInCentimeters,
      age: user.age,
      bodyFatPercentage: user.bodyFatPercentage,
      goal: user.goal ?? undefined,
      workoutTimeExperience: user.workoutTimeExperience ?? undefined,
      workoutFrequency: user.workoutFrequency ?? undefined,
      workoutType: user.workoutType ?? undefined,
      isPersonal: user.isPersonal,
      personalUserId: user.personalUserId,
      personalWorkoutPlanId: user.personalWorkoutPlanId,
      personalStartDate:
        user.personalStartDate != null
          ? user.personalStartDate.toISOString()
          : null,
      personalFinishDate:
        user.personalFinishDate != null
          ? user.personalFinishDate.toISOString()
          : null,
    };
  }
}
