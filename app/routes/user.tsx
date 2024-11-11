import type { ActionFunctionArgs } from "@remix-run/node";
import { data, redirect } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import { db } from "~/db.server";
import { usersTable } from "~/schema";
import { eq } from "drizzle-orm";

export async function loader() {
  const users = await db.select().from(usersTable);
  return { users };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const id = formData.get("id");
  const name = formData.get("name");
  const age = formData.get("age");
  const email = formData.get("email");

  // Basic validation
  if (
    typeof name !== "string" ||
    typeof age !== "string" ||
    typeof email !== "string"
  ) {
    return data({ error: "Invalid Form Data" }, { status: 400 });
  }

  const ageNumber = parseInt(age, 10);

  try {
    if (intent === "create") {
      await db.insert(usersTable).values({
        name,
        age: ageNumber,
        email,
      });
    } else if (id && typeof id === "string") {
      await db
        .update(usersTable)
        .set({
          name,
          age: ageNumber,
          email,
        })
        .where(eq(usersTable.id, parseInt(id, 10)));
    }
    return redirect("/users");
  } catch (error) {
    return data({ error: (error as Error).message }, { status: 500 });
  }
}

export default function UsersPage() {
  const { users } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Users</h1>
      <div className="mb-8">
        <h2>Create New User</h2>
        <Form method="post">
          <input type="hidden" name="intent" value="create" />
          <div>
            <label>
              Name:
              <input type="text" name="name" required />
            </label>
          </div>
          <div>
            <label>
              Age:
              <input type="number" name="age" required />
            </label>
          </div>
          <div>
            <label>
              Email:
              <input type="email" name="email" required />
            </label>
          </div>
          <button type="submit">Create User</button>
        </Form>
      </div>

      <h2>Existing Users</h2>
      {users.map((user) => (
        <Form method="post" key={user.id}>
          <input type="hidden" name="id" value={user.id} />
          <div>
            <label>
              Name:
              <input type="text" name="name" defaultValue={user.name} required />
            </label>
          </div>
          <div>
            <label>
              Age:
              <input type="number" name="age" defaultValue={user.age} required />
            </label>
          </div>
          <div>
            <label>
              Email:
              <input type="email" name="email" defaultValue={user.email} required />
            </label>
          </div>
          <button type="submit">Save</button>
        </Form>
      ))}
    </div>
  );
}
