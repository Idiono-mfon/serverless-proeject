import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { createLogger } from "../utils/logger";
import { TodoItem } from "../models/TodoItem";
import { TodoUpdate } from "../models/TodoUpdate";

const XAWS = AWSXRay.captureAWS(AWS);

const logger = createLogger("TodosAccess");

export class TodoAccess {
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

    logger.info("completed querying all todos");

    return items as TodoItem[];
  }

  async TodoItemExists(todoId: string): Promise<boolean> {
    logger.info("Initiated querying a todo item");

    const result = await this.docClient
      .get({
        TableName: this.todosTable,
        Key: {
          id: todoId,
        },
      })
      .promise();

    logger.info("completed querying a todo item: ", result);
    return !!result.Item;
  }

  async getTodoItem(todoId: string): Promise<TodoItem> {
    logger.info("Initiated querying a todo item");

    const result = await this.docClient
      .get({
        TableName: this.todosTable,
        Key: {
          id: todoId,
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

    logger.info("completed creating a todo item");

    return todoItem;
  }
}

function createDynamoDBClient() {
  // if (process.env.IS_OFFLINE) {
  //   console.log("Creating a local DynamoDB instance");
  //   return new XAWS.DynamoDB.DocumentClient({
  //     region: "localhost",
  //     endpoint: "http://localhost:8000",
  //   });
  // }

  return new AWS.DynamoDB.DocumentClient();
  // return new XAWS.DynamoDB.DocumentClient();
}
