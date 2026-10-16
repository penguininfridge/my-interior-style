// @ts-nocheck
/* 診断データ：ブランド・納品事例・タイプ・質問。文言や画像の差し替えはこのファイルだけで完結します。 */
export const BASE = "https://www.cera.co.jp";
export const LINKS = { showroom:"https://cera.resv.jp/", catalogue:BASE+"/catalogue/" };
export const img = f => `${BASE}/files/topics/${f}.jpg`;   // 画像はセラトレーディング納品事例より（公開前に使用許諾を確認）

export const BRANDS = {
  VOLA:{name:"VOLA",country:"Denmark",id:60}, DURAVIT:{name:"DURAVIT",country:"Germany",id:43},
  FIMA:{name:"FIMA",country:"Italy",id:45}, HANSGROHE:{name:"HANSGROHE",country:"Germany",id:51},
  KWC:{name:"KWC",country:"Switzerland",id:55}, KEUCO:{name:"KEUCO",country:"Germany",id:53},
  EMCO:{name:"EMCO",country:"Germany",id:44}, KINDRED:{name:"KINDRED",country:"Canada",id:54},
  AGAPE:{name:"AGAPE",country:"Italy",id:42}, FLAMINIA:{name:"FLAMINIA",country:"Italy",id:46},
  SCARABEO:{name:"SCARABEO",country:"Italy",id:57}, AXOR:{name:"AXOR",country:"Germany",id:13206},
  GEBERIT:{name:"GEBERIT",country:"Switzerland",id:48}, HORUS:{name:"HORUS",country:"France",id:52},
  GIORGIO:{name:"GIORGIO",country:"Italy",id:50}, VB:{name:"VILLEROY & BOCH",country:"Germany",id:58},
  ZUCCHETTI:{name:"ZUCCHETTI",country:"Italy",id:75}, LAUFEN:{name:"LAUFEN",country:"Switzerland",id:56},
  VITRA:{name:"VITRA",country:"Turkey",id:59}, GEESA:{name:"GEESA",country:"Netherlands",id:49},
};
export const brandUrl = id => `${BASE}/brand/detail/id=${id}`;

// 納品事例：used は各事例ページに掲載されている使用商品のブランド（2026/10 時点で確認）
export const CASES = {
  kamimeguro:{title:"上目黒の家",area:"東京都・新築戸建",id:14097,used:["VOLA","VILLEROY & BOCH"],
    imgs:["14097_ext_06_0","14097_ext_14_6","14097_ext_15_6","14097_ext_14_4","14097_ext_15_4","14097_ext_14_1"]},
  shimouma:{title:"House Shimouma",area:"東京都・マンションリフォーム",id:13913,used:["VOLA","VILLEROY & BOCH","ZUCCHETTI","HANSGROHE"],
    imgs:["13913_ext_06_0","13913_ext_14_6","13913_ext_15_6","13913_ext_14_0","13913_ext_15_0"]},
  hHouse2607:{title:"H様邸",area:"東京都・マンションリフォーム",id:14048,used:["HANSGROHE","SCARABEO","VOLA"],
    imgs:["14048_ext_06_0","14048_ext_14_6","14048_ext_15_6","14048_ext_14_4","14048_ext_15_4"]},
  hHouse2512:{title:"H様邸",area:"神奈川県・マンションリフォーム",id:13904,used:["DURAVIT","HANSGROHE"],
    imgs:["13904_ext_06_0","13904_ext_14_6","13904_ext_14_0","13904_ext_14_4","13904_ext_14_1","13904_ext_15_1","13904_ext_14_5"]},
  vista:{title:"VISTA",area:"東京都・マンションリフォーム",id:14085,used:["FLAMINIA","AXOR","HANSGROHE","VILLEROY & BOCH"],
    imgs:["14085_ext_06_0","14085_ext_14_6","14085_ext_15_6","14085_ext_14_0","14085_ext_15_0","14085_ext_14_4","14085_ext_15_4","14085_ext_14_1","14085_ext_15_1"]},
  villaK:{title:"Villa K",area:"長野県・新築戸建",id:13935,used:["SCARABEO","HANSGROHE"],
    imgs:["13935_ext_06_0","13935_ext_14_6","13935_ext_15_6","13935_ext_14_0","13935_ext_15_0"]},
  tdRes:{title:"TD Residence",area:"愛知県・新築戸建",id:13936,used:["AXOR","LAUFEN"],
    imgs:["13936_ext_06_0","13936_ext_14_6","13936_ext_14_0","13936_ext_14_5","13936_ext_14_3","13936_ext_14_1","13936_ext_15_1","13936_ext_14_4"]},
  myoko:{title:"妙高高原のホテル",area:"新潟県・ホテル",id:14045,used:["AXOR","LAUFEN","FIMA","VILLEROY & BOCH","HANSGROHE"],
    imgs:["14045_ext_06_0","14045_ext_14_4","14045_ext_14_6","14045_ext_15_6","14045_ext_14_1","14045_ext_15_1","14045_ext_14_0","14045_ext_15_0"]},
  infini:{title:"天空のVilla -Infini-",area:"千葉県・別荘／宿泊施設",id:13980,used:["HORUS","VOLA","LAUFEN","DURAVIT"],
    imgs:["13980_ext_06_0","13980_ext_14_6","13980_ext_14_0","13980_ext_14_1","13980_ext_14_5","13980_ext_14_4","13980_ext_15_4","13980_ext_14_3","13980_ext_14_2","13980_ext_15_2","13980_ext_14_7","13980_ext_14_8","13980_ext_15_8"]},
  riff:{title:"RIFFhouse",area:"神奈川県・新築戸建",id:14084,used:["ZUCCHETTI","KWC","SCARABEO"],
    imgs:["14084_ext_06_0","14084_ext_14_6","14084_ext_14_4","14084_ext_14_1","14084_ext_15_1"]},
  machinaka:{title:"まちなかの緑 / 緑の中のいえ",area:"新築戸建",id:13981,used:["ZUCCHETTI","KWC","DURAVIT"],
    imgs:["13981_ext_06_0","13981_ext_14_6","13981_ext_14_0","13981_ext_15_0","13981_ext_16_0"]},
  iHouse:{title:"I様邸",area:"山梨県・新築戸建",id:13807,used:["VOLA","HANSGROHE","SCARABEO","LAUFEN","AXOR"],
    imgs:["13807_ext_06_0","13807_ext_14_6","13807_ext_14_0","13807_ext_14_4","13807_ext_14_1","13807_ext_15_1","13807_ext_14_5","13807_ext_15_5"]},
  sHouse:{title:"S様邸",area:"東京都・新築戸建",id:13593,used:["HORUS","VILLEROY & BOCH","SCARABEO","ZUCCHETTI","HANSGROHE"],
    imgs:["13593_ext_06_0","13593_ext_14_6","13593_ext_15_6","13593_ext_16_6","13593_ext_14_0","13593_ext_15_0","13593_ext_14_1","13593_ext_14_5","13593_ext_15_5"]},
  machikoen:{title:"まちと公園を纏う家",area:"東京都・新築戸建",id:13395,used:["FLAMINIA"],
    imgs:["13395_ext_06_0","13395_ext_14_6","13395_ext_14_0","13395_ext_15_0","13395_ext_14_1","13395_ext_14_5","13395_ext_14_4"]},
};
export const caseUrl = id => `${BASE}/casestudy/detail/id=${id}`;

export const TYPES = {
  A:{slug:"minimal",name:"静かなミニマリスト",en:"Quiet Minimalist",origin:"Timeless Minimal",color:"#8a7a64",hero:["iHouse","13807_ext_14_6"],
    catch:"足さない美しさを、知っている人。",
    desc:"流行よりも、10年後も好きでいられるものを選ぶあなた。余白や光、素材の手ざわりに敏感で、主張しすぎないデザインに心がほどけます。水まわりも「空間に溶け込む」ことが、いちばんの贅沢。",
    tags:["余白","素材感","タイムレス","静けさ"],
    brands:[
      {key:"VOLA",main:true,note:"建築家アルネ・ヤコブセンが1968年にデザインした水栓。MoMAのコレクションにも選ばれ、半世紀を経ても色あせないミニマルな名作です。"},
      {key:"DURAVIT",note:"セシリエ・マンツによる北欧エレガンス「Luv」や、無駄をそぎ落とした「L-Cube」など、穏やかなフォルムがそろいます。"},
      {key:"FIMA",note:"ミニマルでスリムなフォルムが印象的な「Mast」シリーズ。環境への配慮にも力を入れるイタリアの水栓メーカー。"}],
    designers:[["Arne Jacobsen","jacobsen","VOLAの水栓を生んだデンマークの巨匠。壁から水栓だけを出し、余計なものを削ぎ落とす。その引き算の美学が、静けさを好むあなたにぴったり。"],["Cecilie Manz","cecilie_manz","DURAVIT「Luv」を手がけたデンマークのデザイナー。装飾を削ぎつつ、触れたときの柔らかさを残す。ミニマルでも冷たくない空間を好むあなたに。"]],
    cases:["iHouse","kamimeguro"]},
  B:{slug:"precision",name:"精密な合理主義者",en:"Precision Rationalist",origin:"German & Swiss Function",color:"#5f6b73",hero:["hHouse2607","14048_ext_15_6"],
    catch:"美しさは、使いやすさの中にある。",
    desc:"段取り上手で、道具選びには一家言あり。操作感や耐久性、掃除のしやすさまで比べてから選ぶあなたには、技術者の誠実さが宿るドイツ・スイスの水栓がよく似合います。毎日ストレスなく使えることこそ、本当の美しさ。",
    tags:["機能美","精度","効率","信頼"],
    brands:[
      {key:"HANSGROHE",main:true,note:"1901年創業。シャワーのウォールバーを世界で初めて発売した、水まわりのイノベーター。快適さと長く飽きないデザインを両立します。"},
      {key:"KWC",main:true,note:"オルゴール製造から始まったスイスの精密技術。全数検査で品質を守り、スムーズな操作感にもこだわる水栓です。"},
      {key:"KEUCO",note:"緻密な職人技と完璧な機能性を追求する、ドイツのバスルームアクセサリーのスペシャリスト。"},
      {key:"EMCO",note:"合理的なデザインポリシーが各国で評価される、ドイツのバスルームアクセサリー。"},
      {key:"KINDRED",note:"独自の金属加工技術によるキッチンシンク。シンプルで実用的なつくりに定評があるカナダのメーカー。"}],
    designers:[["Phoenix Design","phoenix_design","hansgroheとAXORの製品を長く手がけるドイツのデザインスタジオ。使いやすさを徹底的に検証して形を決める。理由のあるデザインを選ぶあなたと同じ考え方。"]],
    cases:["hHouse2607","hHouse2512"]},
  C:{slug:"artist",name:"感性のアーティスト",en:"Sensual Artist",origin:"Italian Art",color:"#a3654e",hero:["machikoen","13395_ext_14_1"],
    catch:"水まわりは、暮らしのなかのギャラリー。",
    desc:"心が動くかどうかが、選ぶ基準。人と同じでは物足りず、空間に自分だけの物語を描きたいあなた。彫刻のような洗面ボウルが、毎日の身支度をちょっとした鑑賞体験に変えてくれます。",
    tags:["独創性","アート","表現","感性"],
    brands:[
      {key:"AGAPE",main:true,note:"パトリシア・ウルキオラがコモ湖の5つ星ホテルのためにデザインした、彫刻のような「Lariana」。斬新で芸術的なイタリアのバスルームブランド。"},
      {key:"FLAMINIA",main:true,note:"ジュリオ・カッペリーニやnendoが手がける、水まわりとインテリアの境界を越える洗面ボウル。"},
      {key:"SCARABEO",note:"薄いリムが美しいイタリアの衛生陶器。セラトレーディングと共同開発した手洗器「C30」も人気です。"}],
    designers:[["Patricia Urquiola","urquiola","AGAPEの洗面ボウルやバスタブを手がける。素材・色・模様を大胆に重ね、記憶や感情に訴える空間をつくる。感性で選ぶあなたに近い存在。"],["Giulio Cappellini","giulio","FLAMINIAの「Mini Wash」を手がけ、Cappelliniでは若い才能を見出してきた。色や形の常識を超える実験精神が、あなたのアート感覚と響き合う。"],["Oki Sato / nendo","oki","FLAMINIAの洗面ボウル「Roll」は、紙をくるりと巻いたような形。日常の小さな気づきを形にする遊び心が、あなたの感性に合う。"]],
    cases:["machikoen","vista"]},
  D:{slug:"executive",name:"本物志向のエグゼクティブ",en:"Authentic Executive",origin:"Luxury Designers",color:"#2d2a26",hero:["tdRes","13936_ext_14_5"],
    catch:"妥協しないことが、いちばんの心地よさ。",
    desc:"いいものを知っているからこそ、選ぶ目は厳しい。ホテルのスイートのような上質さを、毎日の暮らしに求めるあなた。世界的なデザイナーがトータルで手がけるプレミアムなバスルームがふさわしい人です。",
    tags:["上質","本物","自信","ホテルライク"],
    brands:[
      {key:"AXOR",main:true,note:"ハンスグローエが擁するラグジュアリーブランド。フィリップ・スタルク、アントニオ・チッテリオらがバスルームをトータルにデザインします。"},
      {key:"GEBERIT",note:"スイス最大手のサニタリーメーカー。アントニオ・チッテリオらとの協業によるタイムレスなデザインで、世界のホテルにも採用されています。"}],
    designers:[["Philippe Starck","starck","AXORやDURAVITと数々の名作を生んだフランスの巨匠。水そのものの美しさを形にする。本物と時代を超える存在感を求めるあなたに。"],["Antonio Citterio","citterio","AXOR Citterioを手がけるイタリアの建築家。端正なプロポーションと上質な仕上げを大切にし、華美ではない品格を好むあなたの感覚に合う。"],["Barber & Osgerby","barber_and_osgerby","AXOR Oneを手がけた英国のデュオ。複雑なレバーを押すだけのパネルに置き換え、誰でも直感的に使える形へ。機能も美しさも妥協しないあなたに。"]],
    cases:["tdRes","myoko"]},
  E:{slug:"romantic",name:"ロマンティック・クラシック",en:"Romantic Classic",origin:"French & Classic Craft",color:"#9a7b3f",hero:["sHouse","13593_ext_14_1"],
    catch:"時を重ねたものに、心がときめく。",
    desc:"古いものや手仕事に宿る物語が好き。流行よりも、受け継がれてきた美しさを大切にするあなた。真鍮の輝きや手描きの模様が、洗面室を自分だけの特別な場所にしてくれます。",
    tags:["ノスタルジー","手仕事","物語","温かみ"],
    brands:[
      {key:"HORUS",main:true,note:"“古き佳き時代”を素材にした、フランスのノスタルジックな水栓。世界の宮殿や城のホテルにも採用されています。"},
      {key:"GIORGIO",main:true,note:"ミラノのアトリエで職人が一つひとつ手作りする洗面器。手描きの花柄など、同じものはほとんどありません。"},
      {key:"VB",note:"1748年創業、マリア・テレジアにも愛された陶磁器の名門。ひときわ美しい陶器の白が魅力です。"}],
    designers:[],
    cases:["sHouse","infini"]},
  F:{slug:"playful",name:"遊び心のミックス派",en:"Playful Mixer",origin:"Modern Mix",color:"#4f7d73",hero:["riff","14084_ext_14_6"],
    catch:"正解は、自分で決めていい。",
    desc:"好奇心旺盛で、新しいもの・意外な組み合わせにワクワクするあなた。決めつけず、暮らしながら変えていく柔軟さが魅力です。遊び心のあるイタリアンデザインや新素材の器が、毎日に新鮮な刺激をくれます。",
    tags:["好奇心","ミックス","新素材","自由"],
    brands:[
      {key:"ZUCCHETTI",main:true,note:"遊び心のあるモダンなイタリアン水栓。パロンバ夫妻による「JINGLE」など、インパクトのあるデザインが魅力。"},
      {key:"LAUFEN",main:true,note:"イタリアの情感と北欧の明快さを融合したスイスブランド。極薄の洗面ボウルを実現した新素材「サファイアケラミック」も。"},
      {key:"VITRA",note:"トルコのハマム（入浴）文化から生まれたバスルーム。マティオ・トゥーンとの協業でも知られます。"},
      {key:"GEESA",note:"マルセル・ワンダースを起用したこともある、オランダのバスルームアクセサリー専門メーカー。"}],
    designers:[["Konstantin Grcic","grcic","LAUFENの洗面器「Val」を手がけたドイツのデザイナー。鋭いエッジに遊び心を効かせる。定番に意外性を足したいあなたに。"],["Matteo Thun","matteo","ZUCCHETTI・VITRA・DURAVITを手がけるイタリアの建築家。シンプルな形に木や石の自然素材を合わせる。いろいろな要素を心地よくまとめるあなたの感覚に近い。"],["Ludovica + Roberto Palomba","palomba","ZUCCHETTIの水栓などを手がけるイタリアのデュオ。石のようになめらかな曲線で、リビングのようにくつろげるバスルームをつくる。自由に楽しむあなたに。"]],
    cases:["riff","machinaka"]},
};
export const ORDER = ["A","B","C","D","E","F"];

// 12問 × 4択。各タイプがちょうど8回ずつ登場
export const QUESTIONS = [
  {q:"休日の朝、いちばん心地いい過ごし方は？",o:[["窓辺でコーヒーを淹れて、静かに本を読む","A"],["決めておいた予定を、てきぱき片づける","B"],["美術館やギャラリーへ、ふらっと出かける","C"],["少し早起きして、ホテルのモーニングへ","D"]]},
  {q:"旅先で泊まるなら、どんな宿？",o:[["自然に溶け込む、木の香りのする小さな宿","A"],["歴史ある古城やクラシックホテル","E"],["話題のデザインホテル・アートホテル","C"],["一棟貸しのヴィラや、ちょっと変わった宿","F"]]},
  {q:"部屋に飾るなら？",o:[["何も飾らない。余白がいちばん","A"],["一目惚れしたアート作品","C"],["アンティークの花瓶と季節の花","E"],["旅先で集めた雑貨をあれこれミックス","F"]]},
  {q:"買い物でいちばん重視するのは？",o:[["長く使えて、飽きないこと","A"],["機能・スペック・使いやすさ","B"],["一流ブランドの確かな品質","D"],["職人の手仕事や、そのものの物語","E"]]},
  {q:"友人からよく言われるのは？",o:[["「落ち着いてるね」","A"],["「しっかりしてて頼れる」","B"],["「センスが独特だね」","C"],["「いつも楽しそう」","F"]]},
  {q:"惹かれる色の組み合わせは？",o:[["ホワイト × ナチュラルウッド","A"],["グレー × ステンレス","B"],["ブラック × ゴールド","D"],["アイボリー × アンティークブラス","E"]]},
  {q:"理想の家は？",o:[["収納も動線も完璧で、いつもすっきり片づく家","B"],["アートや一点ものが主役の、ギャラリーのような家","C"],["ホテルのスイートのような、上質で贅沢な家","D"],["色や素材を自由に組み合わせた、遊び心のある家","F"]]},
  {q:"特別な日のレストラン選びは？",o:[["予約の取れない名店のコース","D"],["昔から変わらない老舗のビストロ","E"],["オープンしたばかりの創作料理の店","F"],["地元の食材を使った素朴な店","A"]]},
  {q:"あなたの仕事のスタイルは？",o:[["段取りを組んで、効率よく進める","B"],["アイデアを形にするのが好き","C"],["結果にこだわり、妥協しない","D"],["いろんな人と組んで、新しいことに挑戦","F"]]},
  {q:"夜にひとりで映画を観るなら？",o:[["静かな北欧映画","A"],["緻密なミステリーやドキュメンタリー","B"],["美しいクラシック映画・時代もの","E"],["予想を裏切るSFやコメディ","F"]]},
  {q:"もらっていちばん嬉しいプレゼントは？",o:[["一生ものの腕時計","D"],["手書きの手紙と、古い写真集","E"],["アーティストの一点もの","C"],["気になっていた最新ガジェット","B"]]},
  {q:"家づくりで、いちばん大切にしたいことは？",o:[["自分らしい表現ができること","C"],["素材も設備も、本物であること","D"],["住み継がれていく温かみ","E"],["暮らしながら変えていける自由さ","F"]]},
];
