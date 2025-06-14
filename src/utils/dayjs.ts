import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/pt-br';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('pt-BR');

export const defaultTimezone = 'America/Sao_Paulo';

dayjs.tz.setDefault(defaultTimezone);

// Exemplos:
// timezone local 'America/New_York' (offset -05:00)

// dayjs('2024-01-01T00:00:00').format('YYYY-MM-DDTHH:mm:ssZ'); //2024-01-01T00:00:00-05:00
// dayjs('2024-01-01T00:00:00').tz('America/Sao_Paulo').format('YYYY-MM-DDTHH:mm:ssZ'); //2024-01-01T02:00:00-03:00
// dayjs('2024-01-01T00:00:00').tz('America/Sao_Paulo', true).format('YYYY-MM-DDTHH:mm:ssZ'); //2024-01-01T00:00:00-03:00

// dayjs('2024-01-01T00:00:00Z').format('YYYY-MM-DDTHH:mm:ssZ'); //2023-12-31T19:00:00-05:00
// dayjs('2024-01-01T00:00:00Z').tz('America/Sao_Paulo').format('YYYY-MM-DDTHH:mm:ssZ'); //2023-12-31T21:00:00-03:00
// dayjs('2024-01-01T00:00:00Z').tz('America/Sao_Paulo', true).format('YYYY-MM-DDTHH:mm:ssZ'); //2023-12-31T19:00:00-03:00

// dayjs('2024-01-01T00:00:00-05:00').format('YYYY-MM-DDTHH:mm:ssZ'); //2024-01-01T00:00:00-05:00
// dayjs('2024-01-01T00:00:00-05:00').tz('America/Sao_Paulo').format('YYYY-MM-DDTHH:mm:ssZ'); //2024-01-01T02:00:00-03:00
// dayjs('2024-01-01T00:00:00-05:00').tz('America/Sao_Paulo', true).format('YYYY-MM-DDTHH:mm:ssZ'); //2024-01-01T00:00:00-03:00

// dayjs('2024-01-01T00:00:00-03:00').format('YYYY-MM-DDTHH:mm:ssZ'); //2023-12-31T22:00:00-05:00
// dayjs('2024-01-01T00:00:00-03:00').tz('America/Sao_Paulo').format('YYYY-MM-DDTHH:mm:ssZ'); //2024-01-01T00:00:00-03:00
// dayjs('2024-01-01T00:00:00-03:00').tz('America/Sao_Paulo', true).format('YYYY-MM-DDTHH:mm:ssZ'); //2023-12-31T22:00:00-03:00

/**
 * ATENÇÃO
 *
 * Evitar criar objetos dayjs usando a função dayjs.tz() com timezone no payload
 * (YYYY-MM-DDTHH:mm:ss+01:00) porque o dayjs, através dessa função,
 * não converte diretamente para o timezone especificado,
 * primeiro ele converte para UTC e depois apenas define o novo timezone
 * como o default ou o passado por parâmetro, sem realmente converter,
 * semelhante a dayjs('2024-01-01T00:00:00-03:00').utc().tz('America/Sao_Paulo', true).
 *
 * Exemplo:
 *
 * timezone local 'America/New_York' (offset -05:00)
 * timezone default 'America/Sao_Paulo' (offset -03:00)
 *
 * days.tz('2024-01-01T00:00:00-03:00').format('YYYY-MM-DDTHH:mm:ssZ'); //2024-01-01T03:00:00-03:00
 * days.tz('2024-01-01T00:00:00Z').format('YYYY-MM-DDTHH:mm:ssZ'); //2024-01-01T00:00:00-03:00
 * days.tz('2024-01-01T00:00:00+08:00').format('YYYY-MM-DDTHH:mm:ssZ'); //2023-12-31T16:00:00-03:00
 * days.tz('2024-01-01T00:00:00-05:00').format('YYYY-MM-DDTHH:mm:ssZ'); //2024-01-01T05:00:00-03:00
 *
 **/

export default dayjs;
