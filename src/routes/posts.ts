export const postRoutes = {
  "/api/posts": {
    GET: () => Response.json([{ id: 1, title: "첫 글" }]),
  },
  "/api/posts/:id": {
    GET: (request: Request & { params: { id: string } }) => {
      return Response.json({ id: request.params.id, title: "글 제목" });
    },
  },
};
