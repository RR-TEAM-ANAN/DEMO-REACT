import mockjs from 'mockjs';

const noProxy = process.env.NO_PROXY === 'true';

const proxy = {
    // User Infomation
    'GET /api/markup': {
        status: '200',
        message: 'success', //fail
        $items: {
          name: 'test_name',
        },
      },
}

export default (noProxy ? {} : delay(proxy, 1000));