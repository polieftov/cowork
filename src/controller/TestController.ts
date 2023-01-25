import {Controller, Get, JsonController, Param, QueryParam} from 'routing-controllers'
import 'reflect-metadata'
import MultiGeocoder from 'multi-geocoder'
import {logger} from "sequelize/types/utils/logger";

@JsonController()
export class TestController {
    @Get('/tests/:id')
    getOne (@Param('id') id: number) {
        return 'This action returns test #' + id
    }

    @Get('/tests')
    getAll(@QueryParam("fir") fir: number, @QueryParam("sec") sec: string, @QueryParam("th") th: number) {
        logger.warn(fir + sec + th)
        return {
            fir: fir,
            sec: sec,
            th: th
        }
    }
}
