import { Controller, Get, Param } from 'routing-controllers'
import 'reflect-metadata'
import MultiGeocoder from 'multi-geocoder'

@Controller()
export class TestController {
    @Get('/tests/:id')
    getOne (@Param('id') id: number) {
        return 'This action returns test #' + id
    }

    @Get('/tests')
    getAll() {



        const geocoder = new MultiGeocoder({provider: 'yandex', coordorder: 'latlong'}),
            provider = geocoder.getProvider();

        const getRequestParams = provider.getRequestParams;
        provider.getRequestParams = function () {
            const result = getRequestParams.apply(provider, arguments);
            result.key = '7d804608-524d-4975-b71b-73e84da83c80';
            return result;
        };

        return geocoder.geocode([{ address: 'Moscow' }, { address: 'New York' }, { address: 'Paris' }, { address: 'London' }])
            .then(function (res) {
                console.log(res);
                return res
            });
    }
}
