import { Controller, Get, Param } from 'routing-controllers'
import 'reflect-metadata'

@Controller()
export class TestController {
    @Get('/tests/:id')
    getOne (@Param('id') id: number) {
        return 'This action returns test #' + id
    }

    @Get('/tests')
    getAll() {
        return 'All tests'
    }
}
