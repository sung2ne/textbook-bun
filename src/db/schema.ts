import { pgTable, serial, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// 카테고리 테이블
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  color: text("color").default("#3B82F6"),
});

// 할 일 테이블 (카테고리 외래 키 추가)
export const todos = pgTable("todos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  completed: boolean("completed").default(false),
  sortOrder: integer("sort_order").default(0),
  categoryId: integer("category_id").references(() => categories.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 관계 정의
export const todosRelations = relations(todos, ({ one }) => ({
  category: one(categories, {
    fields: [todos.categoryId],
    references: [categories.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  todos: many(todos),
}));

// 타입 추론
export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;
export type Category = typeof categories.$inferSelect;
