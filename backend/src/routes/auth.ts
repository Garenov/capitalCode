import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { db, schema } from "../db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET ?? "change-this-to-a-long-random-string";

export const authRoutes = new Elysia({ prefix: "/auth" })
    .use(jwt({ name: "jwt", secret: JWT_SECRET, exp: "7d" }))

    // ── Register ────────────────────────────────────────────────
    .post(
        "/register",
        async ({ body, set, jwt }) => {
            const { name, email, password, phone } = body;

            if (password.length < 6) {
                set.status = 400;
                return { success: false, message: "Password must be at least 6 characters" };
            }

            const existing = await db
                .select({ id: schema.users.id })
                .from(schema.users)
                .where(eq(schema.users.email, email.toLowerCase()))
                .limit(1);

            if (existing.length > 0) {
                set.status = 409;
                return { success: false, message: "Email already registered" };
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const [newUser] = await db
                .insert(schema.users)
                .values({
                    name,
                    email: email.toLowerCase(),
                    password: hashedPassword,
                    phone: phone ?? null,
                })
                .returning();

            const { password: _, verifyToken, ...userResponse } = newUser;

            const token = await jwt.sign({ userId: newUser.id, email: newUser.email });

            set.status = 201;
            return { success: true, message: "Registered successfully", token, user: userResponse };
        },
        {
            body: t.Object({
                name: t.String({ minLength: 1 }),
                email: t.String({ format: "email" }),
                password: t.String({ minLength: 6 }),
                phone: t.Optional(t.String()),
            }),
        }
    )

    // ── Login ───────────────────────────────────────────────────
    .post(
        "/login",
        async ({ body, set, jwt }) => {
            const { email, password } = body;

            const users = await db
                .select()
                .from(schema.users)
                .where(eq(schema.users.email, email.toLowerCase()))
                .limit(1);

            if (users.length === 0) {
                set.status = 401;
                return { success: false, message: "Invalid email or password" };
            }

            const user = users[0];
            const valid = await bcrypt.compare(password, user.password);

            if (!valid) {
                set.status = 401;
                return { success: false, message: "Invalid email or password" };
            }

            const { password: _, verifyToken, ...userResponse } = user;
            const token = await jwt.sign({ userId: user.id, email: user.email });

            return { success: true, message: "Login successful", token, user: userResponse };
        },
        {
            body: t.Object({
                email: t.String({ format: "email" }),
                password: t.String({ minLength: 1 }),
            }),
        }
    );
