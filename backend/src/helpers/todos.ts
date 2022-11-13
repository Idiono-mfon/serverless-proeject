import { TodosAccess } from "./todosAcess";
import { generateSignedUrl } from "./attachmentUtils";
import { TodoItem } from "../models/TodoItem";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";
import { createLogger } from "../utils/logger";
import * as uuid from "uuid";
import * as createError from "http-errors";
// import { info } from "console";

// TODO: Implement businessLogic
const logger = createLogger("TodoService");

// import { getUserId } from "../auth/utils";

const todoAccess = new TodosAccess();

export async function getAllTodos(userId: string): Promise<TodoItem[]> {
  logger.info("Called todoAccess.getAllTodoItems");

  return todoAccess.getAllTodoItems(userId);
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {
  const itemId = uuid.v4();
  // const userId = "1";
  logger.info("Called todoAccess.createGroup");

  return await todoAccess.createTodoItem({
    todoId: itemId,
    userId,
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    createdAt: new Date().toISOString(),
    done: false,
    attachmentUrl: "https://test",
  });
}

export async function getTodo(todoItem: string, userId: string) {
  logger.info(`Called todoAccess.getTodoItem with ${todoItem}`);
  return await todoAccess.getTodoItem(todoItem, userId);
}

export async function updateTodo(
  todoItem: string,
  userId: string,
  updatedFields: UpdateTodoRequest
) {
  logger.info(`Called todoAccess.TodoItemExists with ${todoItem}`);
  //   Check if TodoItem exist
  const todoExists = await todoAccess.TodoItemExists(todoItem, userId);

  if (!todoExists) throw createError(404, "Todo Item does not exist");

  logger.info(
    `Called todoAccess.updateTodoItem with ${todoItem} and ${updatedFields}`
  );

  return await todoAccess.updateTodoItem(todoItem, userId, updatedFields);
}

export async function deleteTodo(todoItem: string, userId: string) {
  logger.info(`Called todoAccess.TodoItemExists with ${todoItem}`);
  //   Check if TodoItem exist
  const todoExists = await todoAccess.TodoItemExists(todoItem, userId);

  if (!todoExists) throw createError(404, "Todo Item does not exist");

  logger.info(`Called todoAccess.deleteTodoItem with ${todoItem} `);

  return await todoAccess.deleteTodoItem(todoItem, userId);
}

export async function createAttachmentPresignedUrl(
  todoItemId: string,
  userId: string
) {
  const todoExists = await todoAccess.TodoItemExists(todoItemId, userId);

  if (!todoExists) throw createError(404, "Todo Item does not exist");
  const { uploadUrl, attachmentUrl } = generateSignedUrl(todoItemId);

  const result = await todoAccess.updateTodoUrl(
    todoItemId,
    userId,
    attachmentUrl
  );

  if (!result)
    throw createError(500, "Error occured while creating attachment URL");

  return uploadUrl;
}
