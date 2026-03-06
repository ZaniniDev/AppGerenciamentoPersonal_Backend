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
  goal: string | null;
  workoutTimeExperience: number | null; //tempo de treino em anos
  workoutFrequency: number | null; //frequencia de treino de 1 a 7 dias
  workoutType: string | null;
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
      goal: user.goal,
      workoutTimeExperience: user.workoutTimeExperience,
      workoutFrequency: user.workoutFrequency,
      workoutType: user.workoutType,
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
