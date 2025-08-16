import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { signUpSchema } from "@/server/schema/AuthSchema";
import { TRPCError } from "@trpc/server";
import { hash } from "bcryptjs";

export const authenticationRouter = createTRPCRouter({
  signUp: publicProcedure
    .input(signUpSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const isUserExist = await ctx.db.user.findUnique({
          where: {
            email: input.email,
          },
        });

        if (isUserExist) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "User already exists.",
          });
        }

        const hashedPassword = await hash(input.password, 10);

        const randomDigits = Array.from(
          { length: 10 },
          () => Math.floor(Math.random() * 9) + 1,
        ).join("");
        const username = "user" + randomDigits;

        const user = await ctx.db.user.create({
          data: {
            name: input.name,
            email: input.email,
            password: hashedPassword,
            username,
          },
        });

        return user;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal server error",
        });
      }
    }),
});
