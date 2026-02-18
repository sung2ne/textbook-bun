export const userRoutes = {
  "/api/users": {
    GET: () => Response.json([{ id: 1, name: "Alice" }]),
    POST: async (request: Request) => {
      const body = await request.json();
      return Response.json({ id: 2, ...body }, { status: 201 });
    },
  },
  "/api/users/:id": {
    GET: (request: Request & { params: { id: string } }) => {
      return Response.json({ id: request.params.id, name: "User" });
    },
  },
};
