import { ForbiddenError, NotFoundError } from "../errors/index.js";
import { WeekDay } from "../generated/prisma/enums.js";
import { prisma } from "../lib/db.js";

interface InputDto {
  sessionUserId: string;
  userId: string;
  name: string;
  planGoal: string;
  workoutStartDate?: string;
  workoutFinishDate?: string;
  workoutDays: Array<{
    name: string;
    weekDay: WeekDay;
    isRest: boolean;
    estimatedDurationInSeconds: number;
    coverImageUrl?: string;
    workoutTime?: string;
    exercises: Array<{
      order: number;
      name: string;
      sets: number;
      reps: number;
      restTimeInSeconds: number;
      obs?: string;
      exerciseLoad?: string;
      exerciseId?: string;
    }>;
  }>;
}

interface OutputDto {
  id: string;
  name: string;
  planGoal?: string;
  workoutStartDate?: string;
  workoutFinishDate?: string;
  workoutDays: Array<{
    id: string;
    name: string;
    weekDay: WeekDay;
    isRest: boolean;
    estimatedDurationInSeconds: number;
    coverImageUrl?: string;
    workoutTime?: string;
    exercises: Array<{
      id: string;
      order: number;
      name: string;
      sets: number;
      reps: number;
      restTimeInSeconds: number;
      obs?: string;
      exerciseLoad?: string;
      exerciseId?: string | null;
    }>;
  }>;
}

export class CreateWorkoutPlanForUser {
  async execute(dto: InputDto): Promise<OutputDto> {
    const targetUser = await prisma.user.findUnique({
      where: { id: dto.userId },
    });

    if (!targetUser) {
      throw new NotFoundError("User not found");
    }

    const isOwner = dto.sessionUserId === dto.userId;
    const isPersonal = targetUser.personalUserId === dto.sessionUserId;

    if (!isOwner && !isPersonal) {
      throw new ForbiddenError(
        "You are not authorized to create a workout plan for this user",
      );
    }

    const existingWorkoutPlan = await prisma.workoutPlan.findFirst({
      where: { userId: dto.userId, isActive: true },
    });

    return prisma.$transaction(async (tx) => {
      if (existingWorkoutPlan) {
        await tx.workoutPlan.update({
          where: { id: existingWorkoutPlan.id },
          data: { isActive: false },
        });
      }

      const workoutPlan = await tx.workoutPlan.create({
        data: {
          name: dto.name,
          userId: dto.userId,
          isActive: true,
          planGoal: dto.planGoal,
          workoutStartDate: dto.workoutStartDate
            ? new Date(dto.workoutStartDate)
            : undefined,
          workoutFinishDate: dto.workoutFinishDate
            ? new Date(dto.workoutFinishDate)
            : undefined,
          personalUserId: isPersonal ? dto.sessionUserId : undefined,
          workoutDays: {
            create: dto.workoutDays.map((workoutDay) => ({
              name: workoutDay.name,
              weekDay: workoutDay.weekDay,
              isRest: workoutDay.isRest,
              estimatedDurationInSeconds: workoutDay.estimatedDurationInSeconds,
              coverImageUrl: workoutDay.coverImageUrl,
              workoutTime: workoutDay.workoutTime,
              exercises: {
                create: workoutDay.exercises.map((exercise) => ({
                  name: exercise.name,
                  order: exercise.order,
                  sets: exercise.sets,
                  reps: exercise.reps,
                  restTimeInSeconds: exercise.restTimeInSeconds,
                  obs: exercise.obs,
                  exerciseLoad: exercise.exerciseLoad,
                  exerciseId: exercise.exerciseId,
                })),
              },
            })),
          },
        },
      });

      const result = await tx.workoutPlan.findUnique({
        where: { id: workoutPlan.id },
        include: {
          workoutDays: {
            include: {
              exercises: true,
            },
          },
        },
      });

      if (!result) {
        throw new NotFoundError("Workout plan not found");
      }

      return {
        id: result.id,
        name: result.name,
        planGoal: result.planGoal ?? undefined,
        workoutStartDate: result.workoutStartDate?.toISOString(),
        workoutFinishDate: result.workoutFinishDate?.toISOString(),
        workoutDays: result.workoutDays.map((day) => ({
          id: day.id,
          name: day.name,
          weekDay: day.weekDay,
          isRest: day.isRest,
          estimatedDurationInSeconds: day.estimatedDurationInSeconds,
          coverImageUrl: day.coverImageUrl ?? undefined,
          workoutTime: day.workoutTime ?? undefined,
          exercises: day.exercises.map((exercise) => ({
            id: exercise.id,
            order: exercise.order,
            name: exercise.name,
            sets: exercise.sets,
            reps: exercise.reps,
            restTimeInSeconds: exercise.restTimeInSeconds,
            obs: exercise.obs ?? undefined,
            exerciseLoad: exercise.exerciseLoad ?? undefined,
            exerciseId: exercise.exerciseId,
          })),
        })),
      };
    });
  }
}
