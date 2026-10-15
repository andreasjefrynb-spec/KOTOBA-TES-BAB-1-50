const fs = require('fs');
const path = require('path');

// Raw text blocks for all remaining pages
const ocrTextBab11_25 = `
BAB 11
1 います Ada / mempunyai
2 かかります Memerlukan waktu
3 やすみます （を） 休みます Tidak masuk kerja / libur
4 ひとつ 1 buah
5 ふたつ 2 buah
6 みっつ 3 buah
7 よっつ 4 buah
8 いつつ 5 buah
9 むっつ 6 buah 
10 ななつ 7 buah
11 やっつ 8 buah
12 ここのつ 9 buah
13 とお 10 buah
14 いくつ Berapa buah ?
15 ひとり 1 orang 
16 ふたり 2 orang 
17 ～にん ～人 ~ orang
18 ～だい ～台 ~ unit
19 ～まい ～枚 ~ lembar
20 ～かい ～回 ~ kali
21 りんご Apel
22 みかん Jeruk
23 サンドイッチ Sandwich
24 カレー Kare
25 アイスクリーム Es krim
26 きって 切手 Perangko
27 はがき Kartu pos
28 ふうとう 封筒 Amplop
29 がいこく 外国 Luar negeri
30 りゅうがくせい 留学生 Pelajar asing
31 クラス Kelas
32 ～じかん ～時間 ~ jam
33 ～しゅうかん ～週間 ~ minggu
34 ～かげつ ～か月 ~ bulan
35 ～ねん ～年 ~ tahun
36 ～ぐらい Kira-kira ~
37 どのくらい Berapa lama ?
38 ぜんぶで 全部で Semuanya
39 みんな Semua
40 ～だけ Hanya ~
41 かしこまりました Baik / mengerti
42 いいてんきですね いい天気ですね Cuacanya bagus ya...
43 おでかけですか お出かけですか Mau keluar ?
44 いってらっしゃい 行ってらっしゃい Hati-hati (berangkatnya)
45 いってきます 行ってきます Saya berangkat
46 ふなびん 船便 Pos laut
47 こうくうびん 航空便 Pos udara
48 エアメール Pos udara
49 オーストラリア Australia
50 ていしょく 定食 Makanan paket
51 ランチ Makan siang
52 てんどん 天どん Semangkuk Nasi dan tempura
53 おやこどん Semangkuk Nasi, daging ayam dan telur 
54 ぎゅうどん 牛どん Semangkuk nasi dan daging sapi
55 やきにく 焼肉 Daging panggang
56 やさいため 野菜ため Sayur goreng
57 つけもの 漬物 Asinan
58 みそしる みそ汁 Sup miso
59 おにぎり Nasi kepal
60 てんぷら Tempura
61 すし Nasi dicampur cuka dan diberi ikan mentah
62 うどん Mie jepang ukuran besar
63 そば Mie jepang warna abu-abu
64 ラーメン Mie jepang ukuran biasa
65 やきそば 焼きそば Mie goreng jepang
66 おこのみやき お好み焼き Gorengan dicampur daging di loyang
67 カレーライス Nasi kare
68 ハンバーグ hamburger
69 コロッケ Kroket
70 えびフライ Udang goreng tepung
71 フライドチキン Ayam goreng
72 サラダ Salad
73 スープ Sup
74 スパゲッティ Spageti
75 ピザ Pizza
76 トースト Roti panggang
77 コーヒー Kopi
78 こうちゃ 紅茶 Teh
79 ココア Minuman coklat
80 ジュース Jus
81 コーラ Coca cola

BAB 12
1 かんたん（な） 簡単な Mudah, gampang
2 ちかい 近い Dekat
3 とおい 遠い Jauh
4 はやい 早い，速い Cepat
5 おそい 遅い Lambat
6 おおい 多い Banyak
7 すくない 少ない Sedikit
8 あたたかい 暖かい、温かい Hangat
9 すずしい 涼しい Sejuk
10 あまい 甘い Manis
11 からい 辛い Pedas
12 おもい 重い Berat
13 かるい 軽い Ringan
14 いい Lebih baik
15 きせつ 季節 Musim
16 てんき 天気 Cuaca
17 あめ 雨 Hujan
18 ゆき 雪 Salju
19 くもり 曇り Mendung
20 ホテル Hotel
21 くうこう 空港 Bandara
22 うみ 海 Laut
23 せかい 世界 Dunia
24 パーティー Pesta
25 まつり 祭り Perayaan 
26 レモン Lemon
27 いけばな 生け花 Seni merangkai bunga
28 もみじ 紅葉 Maple
29 どちら Yang mana
30 どちらも Dua-duanya / yang mana saja
31 いちばん Yang paling
32 ずっと Selamanya
33 はじめて 初めて Pertama kali
34 ただいま Saya pulang / saya kembali
35 おかえりなさい お帰りなさい Sudah pulang ya...
36 わあ、すごいひとですね Wah...banyak orang
37 つかれました 疲れました Capek / lelah
38 ホンコン Hongkong
39 シンガポール Singapura
40 めいしょ 名所 Tempat terkenal

BAB 13
1 あそびます 遊びます Bermain
2 およぎます 泳ぎます Berenang
3 むかえます 迎えます Menjemput
4 つかれます 疲れます Lelah
5 けっこんします 結婚します Menikah
6 かいものします 買い物します Berbelanja
7 しょくじします 食事します Makan bersama
8 さんぽします （を） 散歩します Jalan-jalan
9 たいへん（な） 大変な Susah, berat
10 ほしい 欲しい Ingin
11 ひろい 広い Luas
12 せまい 狭い Sempit
13 プール Kolam renang
14 かわ 川 Sungai
15 びじゅつ 美術 Seni
16 つり 釣り Pancing , memancing
17 スキー Ski
18 しゅうまつ 週末 Akhir pekan
19 おしょうがつ お諸王月 Tahun baru
20 ～ごろ Kira-kira , sekitar
21 なにか 何か Sesuatu
22 どこか Suatu tempat
23 のどがかわきます Haus
24 おなかがすきます Lapar
25 そうしましょう Ya ayo
26 ごちゅうもんは ご注文は Mau pesan apa?
27 おまちください お待ちください Tunggu sebentar
28 べつべつに 別々に Sendiri-sendiri / masing-masing
29 はくぶつかん 博物館 Museum
30 びじゅつかん 美術館 Gedung kesenian
31 としょかん 図書館 Perpustakaan
32 えいがかん 映画館 Bioskop
33 どうぶつえん 動物園 Kebun binatang
34 しょくぶつえん 植物園 Kebun raya
35 おてら お寺 Kuil budha
36 じんじゃ 神社 Kuil sinto
37 きょうかい 協会 Gereja
38 たいしかん 体育館 Kedutaan besar
39 にゅうこくかんりきょく 入国管理局 Kantor imigrasi
40 しやくしょ 市役所 Kantor balaikota
41 こうばん 交番 Pos polisi
42 ちゅうしゃじょう 駐車場 Tempat parkir
43 だいがく 大学 Universitas
44 こうこう 高校 Sma
45 ちゅうがっこう 中学校 Smp
46 しょうがっこう 小学校 Sd
47 ようちえん 幼稚園 Tk
48 にくや 肉屋 Toko daging
49 パンや Toko roti
50 さかなや 魚屋 Toko ikan
51 やおや 八百屋 Toko sayuran

BAB 14
1 つけます Menyalakan, memasang, menghidupkan
2 けします 消します Mematikan, memadamkan
3 あけます 開けます Membuka
4 しめます 閉めます Menutup
5 いそぎます 急ぎます Buru-buru
6 まちます 待ちます Menunggu
7 もちます 持ちます Membawa
8 とります 取ります Mengambil
9 てつだいます 手伝います Membantu
10 よびます 呼びます Memanggil
11 はなします 話します Berbicara
12 つかいます 使います Memakai
13 とめます 止めます Menghentikan
14 みせます 見せます Memperlihatkan
15 おしえます 教えます Memberitahu
16 すわります 座ります Duduk
17 たちます 立ちます Berdiri
18 はいります 入ります Masuk
19 でます 出ます Keluar
20 ふります 降ります Turun hujan
21 コピーします Memfotocopy
22 でんき 電気 Listrik, lampu
23 エアコン AC
24 パスポート Paspor
25 なまえ 名前 Nama
26 じゅうしょ 住所 Alamat
27 ちず 地図 Peta
28 しお 塩 Garam
29 さとう 佐藤 Gula
30 もんだい 問題 Masalah, soal
31 こたえ 答え Jawaban
32 よみかた 読み方 Cara membaca
33 ～かた ～方 Cara~
34 まっすぐ Lurus
35 ゆっくり Pelan-pelan, istirahat dengan baik
36 すぐ Segera, langsung
37 また Lagi
38 あとで Nanti
39 もうすこし もう少し Sedikit lagi
40 もう～ ~lagi
41 さあ Mari
42 あれ？ Ah (saat heran atau kaget)
43 これでおねがいします これでお願いします Minta dengan ini
44 おつり お釣り Kembalian
45 きっぷうりば 切符売り場 Loket penjualan karcis
46 じどうけんばいき 自動券売機 Mesin karcis otomatis
47 せいさんき 精算機 Alat penghitung otomatis
48 かいさつぐち 改札口 Pintu pemeriksaan karcis
49 でぐち 出口 Pintu keluar
50 いりぐち 入口 Pintu masuk
51 ひがしぐち 東口 Pintu timur
52 にしぐち 西口 Pintu barat
53 みなみぐち 南口 Pintu selatan
54 きたぐち 北口 Pintu utara
55 ちゅうおうぐち 中央口 Pintu tengah
56 プラットホーム Peron
57 ばいてん 売店 Kios, kedai
58 コインロッカー Loker
59 タクシーのりば Tempat naik taksi
60 バスターミナル Terminal bis
61 バスてい バス停 Halte bis
62 かいそく 快速 Kereta cepat yang lewat pinggir kota
63 じゅんきゅう 準急 Kereta semi cepat
64 じこくひょう 時刻表 Jadwal keberangkatan bis,kereta dll
65 ～はつ ～発 Berangkat dari / berangkat pukul
66 ～ちゃく ～着 Berangkat ke / tiba pukul
67 とうきょういき 東京行き Tujuan tokyo
68 ていきけん 定期券 Kartu langganan berjangka
69 かいすうけん 回数券 Karcis kupon
70 かたみち 片道 Sekali jalan
71 おうふく 往復 Pulang pergi

BAB 15
1 おきます 置きます Meletakkan
2 つくります 作ります Membuat
3 うります 売ります Menjual
4 しります 知ります Mengenal, mengetahui
5 すみます 住みます Tinggal
6 けんきゅうします 研究します Meneliti
7 しりょう 資料 Data, bahan
8 カタログ Katalog
9 ふく 服 Pakaian
10 せいひん 製品 Produk
11 ソフト Perangkat lunak
12 でんしじしょ 電子辞書 Kamus elektronik
13 けいざい 経済 Ekonomi
14 はいしゃ 歯医者 Dokter gigi
15 どくしん 独身 Bujangan, jomblo
16 おもいだします 思い出します Teringat
17 いらっしゃいます Ada (hidup) 
18 しょくぎょう 職業 Pekerjaan , profesi
19 かいしゃいん 会社員 Pegawai perusahaan
20 こうむいん 公務員 Pegawai negeri
21 えきいん 駅員 Pegawai stasiun 
22 ぎんこういん 銀行員 Pegawai bank
23 ゆうびんきょくいん 郵便局員 Pegawai kantor pos
24 てんいん 店員 Pegawai toko
25 ちょうりし 調理師 Tukang masak
26 りようし 理容師 Tukang potong rambut
27 びようし 美容師 Ahli kecantikan
28 きょうし 教師 Guru
29 べんごし 弁護士 Pengacara
30 けんきゅうしゃ 研究者 Peneliti
31 いしゃ 医者 Dokter
32 かんごし 看護師 Perawat 
33 うんてんしゅ 運転手 Sopir 
34 けいさつかん 警察官 Polisi
35 がいこうかん 外交官 Diplomat
36 せいじか 政治家 Politikus
37 がか 画家 Pelukis
38 さっか 作家 Pengarang
39 おんがくか 音楽家 Musisi
40 けんちくか 建築家 Arsitek
41 エンジニア Insinyur
42 デザイナー Perancang busana
43 ジャーナリスト Wartawan
44 かしゅ 歌手 Penyanyi
45 はいゆう 俳優 Aktor / artis
46 スポーツせんしゅ スポーツ選手 Olahragawan / atlit

BAB 16
1 のります （に） 乗ります Naik
2 おります （を） 降ります Turun
3 のりかえます 乗り換えます Ganti, pindah kendaraan
4 あびます （を） 浴びます Mandi
5 いれます 入れます Memasukkan
6 だします 出します Mengeluarkan
7 おろします （を） 下ろします Mengeluarkan/mengambil uang
8 はいります 入ります Masuk
9 でます 出ます Keluar
10 おします 押します Menekan
11 のみます 飲みます Minum
12 はじめます 始めます Mulai
13 けんがくします 見学します Mengunjungi
14 でんわします 電話します Menelepon
15 わかい 若い Muda
16 ながい 長い Panjang
17 みじかい 短い Pendek
18 あかるい 明るい Terang
19 くらい 暗い Gelap
20 からだ 体 Badan
21 あたま 頭 Kepala
22 かみ 髪 Rambut
23 かお 顔 Wajah
24 め 目 Mata
25 みみ 耳 Telinga
26 はな 鼻 Hidung
27 くち 口 Mulut
28 は 歯 Gigi
29 おなか Perut
30 あし 足 Kaki
31 せ 背 Punggung
32 サービス Pelayanan
33 ジョギング Joging
34 シャワー Shower
35 みどり 緑 Hijau
36 おてら お寺 Kuil
37 じんじゃ 神社 Wihara 
38 ～ばん ～番 Nomer 
39 どうやって Dengan cara bagaimana, bagaimana caranya ?
40 どの～ Yang mana?
41 どれ Mana ?
42 すごいですね Hebat
43 いいえ、まだまだです Tidak, belum memuaskan
44 おひきだし お引き出し Penarikan uang
45 まず Pertama-tama, terlebih dahulu
46 つぎに 次に Kemudian, berikutnya
47 キャッシュカード Kartu ATM
48 あんしょうばんごう 暗証番号 PIN
49 きんがく 金額 Jumlah uang
50 かくにん 確認 Memastikan
51 ボタン Tombol
52 ゆきまつり 雪祭り Pesta salju
53 おあずけいれ お預入れ Menambahkan saldo
54 おふりこみ お振込み Pembayaran
55 おふりかえ お振り替え Pengiriman
56 つうちょうきにゅう 通帳記入 Pembaharuan buku catatan bank
57 ざんだかしょうかい 残高照会 Cek saldo

BAB 17
1 おぼえます 覚えます Mengingat
2 わすれます 忘れます Lupa
3 なくします Kehilangan, hilang
4 はらいます 払います Membayar
5 かえします 返します Mengembalikan
6 でかけます 出かけます Keluar rumah
7 ぬぎます 脱ぎます Melepas pakaian
8 もっていきます 持って行きます Membawa pergi
9 もってきます 持って来ます Membawa datang
10 しんぱいします 心配します Khawatir
11 ざんぎょうします 残業します Lembur
12 しゅっちょうします 出張します Dinas
13 たいせつな 大切な Penting
14 だいじょうぶな 大丈夫な Tidak apa-apa
15 あぶない 危ない Berbahaya
16 きんえん 禁煙 Dilarang merokok
17 けんこうほけんしょう 健康保険証 Kartu asuransi kesehatan
18 ねつ 熱 Demam
19 びょうき 病気 Sakit
20 くすり 薬 Obat
21 おふろ Kamar mandi
22 うわぎ 上着 Baju,jaket
23 したぎ 下着 Pakaian dalam
24 までに Sampai dengan ( menyatakan batas waktu )
25 ですから Oleh karena itu
26 どうしましたか Apa yang terjadi , ada masalah apa?
27 のど Tenggorokan
28 いたい 痛い Sakit (nyeri)
29 かぜ Masuk angin
30 それから Setelah itu, kemudian , dan
31 おだいじに お大事に Semoga lekas sembuh
32 あたまがいたい 頭が痛い Sakit kepala
33 おなががいたい Sakit perut
34 はがいたい 歯が痛い Sakit gigi
35 ねつがあります 熱があります Demam
36 せきがでます せきが出ます Batuk
37 はなみずがでます 鼻水が出ます Pilek
38 ちがでます 血が出ます Berdarah
39 はきけがします 吐き気がします Mual
40 さむけがします 寒気がします Kedinginan
41 めまいがします Pusing
42 げりをします 下痢をします Mencret, diare
43 べんぴをします 便秘をします Sembelit
44 けがをします Terluka
45 やけどをします Terbakar
46 しょくよくがありません 食欲がありません Tidak nafsu makan
47 かたがこります 肩が凝ります Bahu pegal
48 からだがだるい 体がだるい Badan lemas
49 かゆい Gatal
50 インフルエンザ Flu, influenza
51 もうちょう 盲腸 Usus buntu
52 ぎっくりごし ぎっくり腰 Sakit pinggang
53 ねんざ Keseleo
54 こっせつ 骨折 Patah tulang
55 ふつかよい 二日酔い Efek sesudah minum

BAB 18
1 できます Dapat, bisa, mampu
2 あらいます 洗います Mencuci
3 ひきます 弾きます Bermain (alat musik , piano)
4 うたいます 歌います Menyanyi
5 あつめます 集めます Mengumpulkan
6 すてます 捨てます Membuang
7 かえます 換えます Menukar, mengganti
8 うんてんします 運転します Menyetir, mengendarai
9 よやくします 予約します Memesan
10 ピアノ Piano
11 ～メートル Meter
12 げんきん 現金 Uang tunai
13 しゅみ 趣味 Hobi , kegemaran
14 にっき 日記 Catatan harian
15 おいのり お祈り Doa
16 かちょう 課長 Kepala seksi
17 ぶちょう 部長 Kepala bagian
18 しゃちょう 社長 Direktur utama
19 どうぶつ 動物 Hewan
20 うま 馬 Kuda
21 インターネット Internet
22 とくに 特に Terutama, khususnya
23 それはおもしろいですね Itu menarik ya...
24 ほんとうですか Betulkah , benarkah
25 ぜひ Pasti, benar-benar
26 なかなか Jarang, tidak mudah (diikuti bentuk negatif)
27 とぶ 飛ぶ Terbang
28 とぶ 跳ぶ Meloncat
29 のぼる 登る Memanjat
30 はしる 走る Berlari
31 およぐ 泳ぐ Berenang
32 もぐる Menyelam
33 とびこむ 飛び込む Terjun
34 さかだちする 逆立ちする Berjungkir balik
35 はう Merayap
36 ける Menendang
37 ふる 振る Melambaikan
38 もちあげる 持ち上げる Mengangkat
39 なげる 投げる Melempar
40 たたく Memukul
41 ひく 引く Menarik
42 おす 押す Menekan, mendorong
43 まげる 曲げる Membengkokkan
44 のばす 伸ばす Meluruskan
45 ころぶ 転ぶ Jatuh
46 ふりむく 振り向く Menengok ke belakang

BAB 19
1 のぼります 登ります、上ります Naik , mendaki
2 とまります （に） 泊まります Menginap
3 そうじします 掃除します Membersihkan
4 せんたくします 洗濯します Mencuci pakaian
5 なります Menjadi
6 ねむい 眠い Mengantuk
7 つよい 強い Kuat
8 よわい 弱い Lemah
9 れんしゅう 練習 Latihan
10 ゴルフ Golf
11 すもう 相撲 Sumo
12 おちゃ お茶 Teh
13 ひ 日 Hari
14 ちょうし 調子 Kondisi
15 いちど 一度 Sekali
16 いちども 一度も Sekalipun
17 だんだん Sedikit demi sedikit, berangsur-angsur
18 もうすぐ Tidak lama lagi , sebentar lagi
19 おかげさまで Atas berkat ( doa ) anda
20 でも Tetapi
21 かんぱい 乾杯 Toast
22 ダイエット Diet
23 むりな 無理な Paksa, berlebihan, tidak mungkin
24 からだにいい 体にいい Baik untuk tubuh
25 とうきょうスカイツリー Tokyo sky tree
26 さどう 茶道 Upacara minum teh
27 かどう 華道 Seni merangkai bunga
28 しょどう 書道 Seni menulis huruf jepang
29 かぶき 歌舞伎 Kabuki (Drama tradisional jepang)
30 のう 能 Noh (Drama topeng tradisional)
31 ぶんらく 文楽 Bunraku (Wayang golek tradisional jepang)
32 じゅうどう 柔道 Judo (Olahraga tradisional jepang)
33 けんどう 剣道 Kendo (Olahraga tradisional jepang)
34 からて 空手 Karate (olahraga beladiri jepang)
35 まんざい。らくご 漫才。落語 Lelucon, komedi
36 いご。しょうぎ 囲碁。将棋 Catur jepang
37 パチンコ Pacinko
38 カラオケ Karaoke
39 ぼんおどり 盆踊り Tarian bon

BAB 20
1 いります （が） 要ります Memerlukan
2 しらべます 調べます Memeriksa,meneliti,mengecek
3 しゅうりします 修理します Memperbaiki
4 ぼく 僕 Aku
5 きみ 君 Kamu
6 ～くん ～君 Saudara~
7 うん Ya
8 ううん Tidak
9 ことば Kata, kosakata ,bahasa
10 きもの 着物 Kimono
11 ビザ Visa
12 はじめ Awal, mula-mula
13 おわり Akhir
14 こっち Sini
15 そっち Situ
16 あっち Sana
17 どっち mana
18 みんなで Kita semua
19 ～けど Tetapi
20 おなかがいっぱいです Kenyang
21 よかったら Kalau mau, kalau suka
22 いろいろ Macam-macam

BAB 21
1 おもいます 思います Mengira, berfikir
2 いいます 言います Berkata, mengatakan
3 かちます 勝ちます Menang
4 まけます 負けます Kalah
5 やくにたちます 役に立ちます Bermanfaat, berguna
6 うごきます 動きます Pindah, bergerak
7 やめます （を） Berhenti
8 きをつけます 気を付けます Berhati-hati, berwaspada
9 りゅうがくします 留学します Studi di luar negeri
10 むだな Sia-sia, tidak berguna
11 ふべんな 不便な Tidak praktis
12 すごい Hebat
13 ほんとう Betul ,benar
14 うそ Bohong
15 じどうしゃ 自動車 Mobil
16 こうつう 交通 Lalu lintas
17 ぶっか 物価 Harga barang
18 ニュース Siaran, pengumuman
19 アニメ Animasi
20 マンガ Komik
21 デザイン Desain, model
22 ゆめ 夢 Mimpi
23 てんさい 天才 Genius
24 しあい 試合 Pertandingan
25 いけん 意見 Pendapat
26 はなし 話 Cerita
27 ちきゅう 地球 Bumi
28 つき 月 Bulan
29 さいきん 最近 Akhir-akhir ini
30 たぶん Mungkin, barangkali
31 きっと Pasti
32 ほんとうに Betul-betul
33 そんなに Tidak begitu (diikuti kata negatif)
34 ～について Tentang ~
35 ひさしぶりですね 久しぶりですね Sudah lama tidak bertemu ya
36 もちろん Tentu saja
37 やくしょくめい 役職名 Nama-nama jabatan
38 とどうふけん 都道府県 Prefektur
39 し 市 Kota
40 まち 町 Distrik,daerah
41 むら 村 Desa
42 しゅしょう 首相 Perdana menteri
43 ちじ 知事 Gubernur
44 しちょう 市長 Wali kota
45 ちょうちょう 町長 Kepala daerah
46 そんちょう 村長 Kepala desa
47 がくちょう 学長 Rektor
48 こうちょう 校長 Kepala sekolah
49 えんちょう 園長 Kepala TK
50 かいちょう 会長 Ketua
51 じゅうやく 重役 Direktur
52 ぶちょう 部長 Kepala bagian
53 かちょう 課長 Kepala seksi
54 とうどり 頭取 Direktur bank
55 してんちょう 支店長 Kepala kantor cabang
56 えきちょう 駅長 Kepala stasiun
57 いんちょう 院長 Direktur rumah sakit
58 かんごしちょう 看護師長 Kepala perawat
59 けいさつ 警察 Kantor polisi
60 しょちょう 署長 Kepala kantor polisi

BAB 22
1 きます 着ます Memakai (pakaian)
2 はきます Memakai (sepatu,celana)
3 かぶります Memakai (topi)
4 かけます （を） Memakai (kacamata)
5 します （を） Memakai (dasi)
6 うまれます 生まれます Lahir
7 わたしたち Kami,kita
8 コート Mantel
9 セーター Sweter / baju hangat
10 スーツ Pakaian setelan
11 ぼうし 帽子 Topi
12 めがね 眼鏡 Kacamata
13 ケーキ Kue
14 おべんとう お弁当 Bekal
15 ロボット Robot
16 ユーモア Humor
17 つごう 都合 Kondisi, keadaan
18 よく Sering , dengan baik
19 おめでとうございます Selamat
20 では Kalau begitu
21 やちん 家賃 Biaya sewa rumah
22 ダイニングキッチン Ruang makan dengan dapur
23 わしつ 和室 Kamar ala jepang
24 おしいれ 押し入れ Lemari dinding ala jepang
25 ふとん 布団 Selimut dan kasur berisi kapas ala jepang
26 パリ Paris
27 ばんりのちょうじょう 万里の長城 Tembok besar cina
28 ワンピース Pakaian terusan
29 うわぎ 上着 Jas
30 パンツ Celana panjang
31 ジーンズ Celana jeans
32 スカート Rok
33 ブラウス Blus
34 ワイシャツ Kemeja
35 マフラー Shal, selendang
36 くつした 靴下 Kaos kaki
37 ストッキング Stoking
38 レインコート Jas hujan
39 ベルト Sabuk, ikat pinggang
40 ハイヒール Sepatu berhak tinggi
41 ブーツ Sepatu bot
42 ぞうり Sandal tradisional jepang
43 たび Kaos kaki tradisional jepang
44 おび 帯 Ikat pinggang tradisional jepang

BAB 23
1 ききます （に） 聞きます Bertanya
2 まわします 回します Memutar
3 ひきます 引きます Menarik, tarik
4 かえます 変えます Mengubah
5 さわります （に） 触ります Menyentuh
6 でます （が） 出ます Keluar
7 あるきます 歩きます Berjalan kaki
8 わたります （を） 渡ります Menyeberang
9 まがります （へ） 曲がります Belok
10 さびしい 寂しい Sepi
11 おゆ お湯 Air panas
12 おと 音 Suara, bunyi
13 サイズ Ukuran
14 こしょう 故障 Kerusakan
15 みち 道 Jalan 
16 こうさてん 交差点 Perempatan
17 しんごう 信号 Lampu lalu lintas
18 かど 角 Sudut
19 はし 橋 Jembatan
20 ちゅうしゃじょう 駐車場 Tempat parkir
21 たてもの 建物 Bangunan, gedung
22 なんかいも 何回も Berkali-kali
23 ～め ～目 Yang ke -
24 どうろ 道路 Jalan
25 ほどう 歩道 Trotoar
26 しゃどう 車道 Jalan mobil
27 こうそくどうろ 高速道路 Jalan tol
28 とおり 通り Jalan
29 おうだんほどう 横断歩道 Tempat menyeberang, zebra cros
30 ほどうきょう 歩道橋 Jembatan penyeberangan
31 さか 坂 Lereng
32 ふみきり 踏切 Lintasan kereta api
33 ガソリンスタンド Pompa bensin , pom bensin
34 とまれ 止まれ Berhenti
35 しんにゅうきんし 進入禁止 Dilarang masuk
36 いっぽうつうこう 一方通行 Satu arah
37 ちゅうしゃきんし 駐車禁止 Dilarang parkir
38 うせつきんし 右折禁止 Dilarang belok kanan

BAB 24
1 くれます Diberikan
2 なおします 直します Mengoreksi , memperbaiki
3 つれていきます 連れて行きます Mengajak pergi, membawa, mengantarkan
4 つれてきます 連れて来ます Membawa datang, membawa datang
5 おくります （を） 送ります Mengantar (orang)
6 しょうかいします 紹介します Memperkenalkan
7 あんないします 案内します Memandu , mengantarkan
8 せつめいします 説明します Menjelaskan, menerangkan
9 おじいさん／おじいちゃん Kakek
10 おばあさん／おばあちゃん Nenek
11 じゅんび 準備 Persiapan
12 ひっこし 引っ越し Pindah rumah
13 おかし お菓子 Kue, snack, makanan ringan
14 ホームステイ Homestay
15 ぜんぶ 全部 Semua
16 じぶんで 自分で Dengan sendiri
17 ほかに Selain, yang lain
18 ははのひ 母の日 Hari ibu
19 ぞうとうのしゅうかん 贈答の習慣 Tukar menukar hadiah
20 おとしだま お年玉 Hadiah kecil yang diberikan orang tua dan keluarga kepada anak-anak pada tahun baru
21 にゅうがくいわい 入学祝い Hadiah yang diberikan kepada anak yang masuk sekolah
22 そつぎょういわい 卒業祝い Hadiah yang diberikan kepada anak yang tamat sekolah
23 けっこんいわい 結婚祝い Hadiah perkawinan
24 しゅっさんいわい 出産祝い Hadiah yang diberikan kepada orang yang melahirkan
25 おちゅうげん／おせいぼ お中元／お歳暮 Hadiah yang diberikan kepada orang yang telah memberi bantuan
26 おこうでん お香典 Uang yang diberikan kepada keluarga yang berduka/ uang duka
27 おみまい お見舞い Hadiah yang diberikan kepada orang yang sedang sakit
28 のしぶくろ 熨斗袋 Amplop khusus untuk hadiah uang

BAB 25
1 かんがえます 考えます Berfikir, memikirkan
2 つきます 着きます Tiba, sampai
3 とります （としを～） 取ります Berumur, usia lanjut
4 たります 足ります Cukup
5 いなか 田舎 Desa, kampung halaman
6 チャンス Kesempatan
7 おく 億 Ratus juta
8 もし Kalau
9 いみ 意味 Arti
10 てんきん 転勤 Pindah kerja, pindah ke kantor cabang lain
11 こと Hal
12 ひまな 暇な Senggang, waktu luang
13 いろいろおせわいなりました いろいろお世話になりました Terima kasih banyak bantuan anda yang telah diberikan
14 がんばります 頑張ります Berusaha, bekerja keras
15 どうぞおげんきで どうぞお元気で Semoga sehat-sehat selalu
16 ひとのいっしょう 人の一生 Seumur hidup manusia
17 せいねん 青年 Remaja
18 ちゅうねん 中年 Setengah baya
19 ろうじん 老人 Orang tua
20 ほいくえん 保育園 Play group
21 ようちえん 幼稚園 TK
22 たんだい 短大 Akademi
23 せんもんがっこう 専門学校 Sekolah tinggi keahlian, sekolah kejuruan
24 しゅうしょくします 就職します Mendapat pekerjaan
25 りこんします 離婚します Bercerai
26 さいこんします 再婚します Menikah lagi
`;

module.exports = { ocrTextBab11_25 };
