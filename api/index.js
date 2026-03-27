const express = require('express');
const cors = require('cors');

const app = express();

// 아이두젠 도메인에서만 접근 가능하도록 보안 설정
const corsOptions = {
    origin: ['https://idoogen.com', 'https://www.idoogen.com'],
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.get('/api/instagram', async (req, res) => {
    // Vercel 환경변수에서 토큰을 가져옵니다.
    const ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
    
    // ★ 여기에 방금 찾으신 인스타그램 숫자 ID를 입력하세요! (예: '17841400000000000') ★
    const IG_ACCOUNT_ID = '17841402333119075'; 

    if (!ACCESS_TOKEN) {
        return res.status(500).json({ success: false, message: '서버에 인스타그램 토큰이 설정되지 않았습니다.' });
    }

    try {
        // 비즈니스 API 버전(v25.0)으로 데이터 호출 (최신 게시물 6개)
        const url = `https://graph.facebook.com/v25.0/${IG_ACCOUNT_ID}/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url&access_token=${ACCESS_TOKEN}&limit=6`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            // 에러 발생 시 Vercel 로그에서 확인하기 위해 출력
            console.error('Meta API Error Details:', data.error);
            throw new Error(data.error.message);
        }

        // 프론트엔드에 필요한 데이터만 깔끔하게 응답
        res.json({ success: true, data: data.data });
        
    } catch (error) {
        console.error('Instagram API Error:', error);
        res.status(500).json({ success: false, message: '인스타그램 피드를 불러오지 못했습니다.' });
    }
});

// Vercel 서버리스 환경을 위한 내보내기
module.exports = app;
