import { mkdir, rename, unlink } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const audioDir = join(root, 'audio');
const outFile = join(audioDir, 'welcome-ai.mp3');

const WELCOME_SPEECH = [
    'مرحباً بكم في الموقع التذكاري للشيخ حمد بن علي بن سعيد الغافري، رحمه الله تعالى، أحد أبرز رواد الشعر الشعبي وفن الميدان في سلطنة عُمان.',
    'وُلِدَ في قرية الدريز بولاية عبري بمحافظة الظاهرة، ونشأ في بيئة عُمانية أصيلة متشبّعاً بالتراث العُماني العريق.',
    'وبرزت موهبته منذ الصغر في الشعر والفروسية والرماية، ليصبح لاحقاً من الأسماء البارزة في الساحة الأدبية والثقافية العُمانية.',
    'ومن أبرز دواوينه الشعرية: على جناح الميدان، ورواحل، ونواعم، والتي جسّدت حضوره الأدبي وتميّزه في الشعر الشعبي وفن الميدان.',
    'كما شغل عدداً من المناصب الحكومية الرفيعة، من بينها: مدير عام شؤون القبائل، ورئيس مكتب السلطنة في دبي، ونائب محافظ ظفار.',
    'وفي عام ألف وتسعمائة وتسعة وثمانين ميلادية، حقق المركز الأول في مسابقة المنتدى الأدبي للشعر الشعبي، تقديراً لمكانته وإبداعه الشعري.',
    'وعُرف رحمه الله بشغفه الكبير بالخيول العربية الأصيلة، وبراعته في الرماية والفروسية منذ سنواته الأولى.',
    'وقد انتقل إلى رحمة الله تعالى في السادس عشر من يناير عام ألفين وواحد وعشرين ميلادية، تاركاً إرثاً ثقافياً وأدبياً بارزاً في ذاكرة الوطن.',
    'ندعوكم لاستكشاف السيرة الذاتية، والدواوين الشعرية، والقصص والمواقف، ومعرض الصور، والمراسيم السلطانية، عبر أقسام هذا الموقع.'
].join(' ');

const VOICE = 'ar-SA-HamedNeural';

async function main() {
    await mkdir(audioDir, { recursive: true });

    const tts = new MsEdgeTTS();
    await tts.setMetadata(VOICE, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3, {
        wordBoundaryEnabled: false,
        sentenceBoundaryEnabled: false
    });

    const { audioFilePath } = await tts.toFile(audioDir, WELCOME_SPEECH, {
        rate: '-5%',
        pitch: '+0Hz',
        volume: '+0%'
    });

    if (audioFilePath !== outFile) {
        try {
            await unlink(outFile);
        } catch {
            /* ignore */
        }
        await rename(audioFilePath, outFile);
    }

    console.log('تم إنشاء:', outFile);
    console.log('الصوت:', VOICE);
}

main().catch((err) => {
    console.error('فشل توليد الصوت:', err.message);
    process.exit(1);
});
