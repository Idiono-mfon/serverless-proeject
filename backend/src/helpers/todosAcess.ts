import * as AWS from "aws-sdk";
// import * as AWSXRay from "aws-xray-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { createLogger } from "../utils/logger";
import { TodoItem } from "../models/TodoItem";
import { TodoUpdate } from "../models/TodoUpdate";

const AWSXRay = require("aws-xray-sdk");

const XAWS = AWSXRay.captureAWS(AWS);

const logger = createLogger("TodosAccess");

export class TodosAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly createdAtIndex = process.env.TODOS_CREATED_AT_INDEX
  ) {}

  async getAllTodoItems(): Promise<TodoItem[]> {
    logger.info("Initiated querying all todos");

    const tomorrow = new Date();

    tomorrow.setDate(new Date().getDate() + 1);

    const result = await this.docClient
      .query({
        TableName: this.todosTable,
        IndexName: this.createdAtIndex,
        KeyConditionExpression: "timestamp < :t",
        ExpressionAttributeValues: {
          ":t": tomorrow.toISOString(),
        },
      })
      .promise();

    const items = result.Items;

    logger.info("completed querying all todos", items);

    return items as TodoItem[];
  }

  async getTodoItem(todoItemId: string): Promise<TodoItem> {
    logger.info("Initiated querying a todo item");

    const result = await this.docClient
      .get({
        TableName: this.todosTable,
        Key: {
          todoId: todoItemId,
        },
      })
      .promise();

    const item = result.Item;

    logger.info("completed querying a todo item: ", result);
    return item as TodoItem;
  }

  async createTodoItem(todoItem: TodoItem): Promise<TodoItem> {
    logger.info("Initiated creating a todo item");

    await this.docClient
      .put({
        TableName: this.todosTable,
        Item: todoItem,
      })
      .promise();

    logger.info(`created a todo item with id: ${todoItem.todoId}`);

    return todoItem;
  }

  async updateTodoItem(
    todoItemId: string,
    updatedFields: TodoUpdate
  ): Promise<TodoItem | null> {
    logger.info("Initiated updating a todo item");

    const result = await this.docClient
      .update({
        TableName: this.todosTable,
        Key: {
          todoId: todoItemId,
        },
        UpdateExpression: "set name = :n, dueDate = :dd, done = :dn",
        ExpressionAttributeValues: {
          ":n": updatedFields.name,
          ":dd": updatedFields.dueDate,
          ":dn": updatedFields.done,
        },
      })
      .promise();

    const item = result.$response.data;

    logger.info(`updated a todo item with id: ${todoItemId}`);

    if (item) return item as TodoItem;

    return null;
  }

  async deleteTodoItem(todoItemId: string): Promise<TodoItem | null> {
    logger.info("Initiated deleting a todo item");

    const result = await this.docClient
      .delete({
        TableName: this.todosTable,
        Key: {
          todoId: todoItemId,
        },
      })
      .promise();

    const item = result.$response.data;

    logger.info(`deleted a todo item with id: ${todoItemId}`);

    if (item) return item as TodoItem;

    return null;
  }

  async TodoItemExists(todoItemId: string): Promise<boolean> {
    logger.info("Initiated querying a todo item");

    const result = await this.docClient
      .get({
        TableName: this.todosTable,
        Key: {
          todoId: todoItemId,
        },
      })
      .promise();

    logger.info("completed querying a todo item: ", result);
    return !!result.Item;
  }
}

function createDynamoDBClient() {
  return new XAWS.DynamoDB.DocumentClient();
  //   return new XAWS.DynamoDB.DocumentClient();
}
