const questionImage = document.getElementById("question-image");
const feedback = document.getElementById("feedback");

let currentQuestionIndex = 0;
let currentQuestion = null;

function loadQuestion() {
    currentQuestion = questions[currentQuestionIndex];
    questionImage.src = currentQuestion.image;
    feedback.textContent = "";
}

document.getElementById("play-audio").addEventListener("click", () => {
    const audio = new Audio(currentQuestion.audio);
    audio.play();
});

document.getElementById("start-speech-recognition").addEventListener("click", () => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
        feedback.textContent = "抱歉，您的浏览器不支持语音识别！";
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = "zh-CN"; // 设置识别语言为中文
    recognition.interimResults = false; // 确保只返回最终结果
    feedback.textContent = "正在聆听，请说话...";

    recognition.start();

    recognition.addEventListener("result", (e) => {
        const transcript = e.results[0][0].transcript.trim();
        if (transcript === currentQuestion.chinese) {
            feedback.textContent = `正确！🎉 你说的是：${transcript}`;
            nextQuestion();
        } else {
            feedback.textContent = `错误！你说的是：${transcript}，正确答案是：${currentQuestion.chinese}`;
        }
    });

    recognition.addEventListener("error", (e) => {
        feedback.textContent = `识别错误：${e.error}`;
    });

    recognition.addEventListener("end", () => {
        feedback.textContent += " 语音识别结束。";
    });
});

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex >= questions.length) {
        feedback.textContent += " 恭喜！您完成了所有问题！";
        currentQuestionIndex = 0; // 重置以重复播放
    } else {
        loadQuestion();
    }
}

// 初始化
loadQuestion();
