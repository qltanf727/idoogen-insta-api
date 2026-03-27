const express = require('express');
const cors = require('cors');
const app = express();

// 모든 보안 검사를 끄고 어디서든 접속 가능하게 설정
app.use(cors({ origin: true, credentials: true })); 

app.get('/api/instagram', async (req, res) => {
    // 캐시 때문에 안 나오는 걸 방지하기 위해 헤더 추가
    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate');
    
    const ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
    const IG_ACCOUNT_ID = '17841402333119075'; 

    try {
        const url = `https://graph.facebook.com/v25.0/${IG_ACCOUNT_ID}/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url&access_token=${ACCESS_TOKEN}&limit=12`;
        const response = await fetch(url);
        const data = await response.json();
        
        // 데이터가 비어있을 경우 에러 메시지 전송
        if (!data.data) {
            return res.status(500).json({ success: false, error: data.error });
        }

        res.json({ success: true, data: data.data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = app;
