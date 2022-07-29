import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateToDo } from '../../businessLogic/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
// import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
    const authorization = event.headers.Authorization;
    const split = authorization.split(' ');
    const jwtToken = split[1];

    const toDoItem = await updateToDo(updatedTodo, todoId, jwtToken);

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
            "item": toDoItem
        }),
    }

  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
