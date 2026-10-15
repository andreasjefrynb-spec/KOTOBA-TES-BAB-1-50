const fs = require('fs');
const path = require('path');

// We have the exact OCR data for all 60 pages from the PDF.
// Let's create an exact parser that parses the text into KotobaItem[].
const ocrPages = [
// Page 1: BAB 1
`BAB 1
1 わたし 私 Saya
2 あなた Kamu
3 あのひと あの人 Orang itu (biasa)
4 あのかた あの方 Orang itu (sopan)
5 ～さん Saudara…….
6 ～ちゃん Panggilan untuk anak laki/perempuan
7 ～じん ～人 Orang…….
8 せんせい 先生 Guru,dosen
9 きょうし 教師 Guru,dosen (dipakai untuk kalangan sendiri)
10 がくせい 学生 Siswa,murid
11 かいしゃいん 会社員 Pegawai perusahaan
12 しゃいん 社員 Pegawai perusahaan
13 ぎんこういん 銀行員 Pegawai bank
14 いしゃ 医者 Dokter
15 けんきゅうしゃ 研究者 Peneliti
16 だいがく 大学 Universitas
17 びょういん 病院 Rumah sakit
18 だれ Siapa (biasa)
19 どなた Siapa (sopan)
20 ～さい ～歳 Umur…..
21 なんさい 何歳 Umur berapa?(biasa)
22 おいくつ Umur berapa?(sopan)
23 はい Iya
24 いいえ Tidak
25 はじめまして Perkenalkan
26 ～からきました ～から来ました Datang dari…..
27 どうぞよろしくおねがいします どうぞよろしくお願します Terimalah perkenalan saya
28 しつれいですが 失礼ですが Permisi
29 おなまえは お名前は Nama anda siapa?
30 アメリカ Amerika
31 イギリス Inggris
32 インド India
33 インドネシア Indonesia
34 かんこく 韓国 Korea
35 ちゅうごく 中国 China
36 ドイツ Jerman
37 にほん 日本 Jepang
38 フランス Perancis`,

// Page 2: BAB 2
`BAB 2
1 これ Ini
2 それ Itu (dekat)
3 あれ Itu (jauh)
4 この～ ～ini
5 その～ ～itu (dekat)
6 あの～ ～itu (jauh)
7 ほん 本 Buku
8 じしょ 辞書 Kamus
9 ざっし 雑誌 Majalah
10 しんぶん 新聞 Koran
11 ノート Buku catatan
12 てちょう 手帳 Buku agenda
13 めいし 名刺 Kartu nama
14 カード Kartu
15 えんぴつ 鉛筆 Pensil
16 ボールペン Bolpoin
17 シャープペンシル Pensil mekanik
18 かぎ 鍵 Kunci
19 とけい 時計 Jam , arloji
20 かさ 傘 Payung
21 かばん 鞄 Tas
22 テレビ Televisi
23 ラジオ Radio
24 カメラ Kamera
25 コンピューター Komputer
26 くるま 車 Mobil
27 つくえ 机 Meja
28 いす 椅子 Kursi
29 チョコレート Coklat
30 コーヒー Kopi
31 おみやげ お土産 Oleh-oleh
32 えいご 英語 Bahasa inggris
33 にほんご 日本語 Bahasa jepang
34 ～ご ～語 Bahasa ～
35 なん 何 Apa
36 そう Begitu
37 あのう Eee ...(ungkapan ketika ragu)
38 えっ Eh (diucapkan ketika mendengar sesuatu diluar dugaan)
39 どうぞ Silakan
40 どうもありがとうございます Terima kasih
41 そうですか O,begitu, benarkah?
42 ちがいます 違います Bukan , Tidak , Salah
43 あ O,eh (dipakai ketika sadar)
44 これからおせわになります これからお世話になります Mulai sekarang saya akan meminta bantuannya
45 こちらこそよろしくおねがいします Ya sama-sama`,

// Page 3 & 4: BAB 3
`BAB 3
1 ここ Disini
2 そこ Disitu
3 あそこ Disana
4 どこ Dimana?
5 こちら Disini
6 そちら Disitu
7 あちら Disana
8 どちら Dimana ?
9 きょうしつ 教室 Ruang kelas
10 しょくどう 食堂 Ruang makan, Kantin
11 じむしょ 事務所 Kantor
12 かいぎしつ 会議室 Ruang rapat
13 うけつけ 受付 Meja informasi
14 ロビー Ruang tunggu, lobi
15 へや 部屋 Kamar
16 おてあらい お手洗い Kamar kecil, WC
17 トイレ Toilet
18 かいだん 階段 Tangga
19 エレベーター Lift
20 エスカレーター Eskalator, tangga berjalan
21 じどうはんばいき 自動販売機 Mesin jual otomatis
22 でんわ 電話 Telepon
23 おくに お国 Negara
24 かいしゃ 会社 Perusahaan
25 うち 家 Rumah
26 くつ 靴 Sepatu
27 ネクタイ Dasi
28 ワイン Anggur putih
29 うりば 売り場 Tempat penjualan
30 ちか 地下 Bawah tanah , basement
31 ～かい ～階 lantai～/ tingkat～
32 なんがい 何階 Lantai berapa?
33 ～えん ～円 ～yen
34 いくら Berapa?
35 ひゃく 百 Seratus
36 せん 千 Seribu
37 まん 万 Puluh ribu
38 すみません Maaf
39 どうも Terima kasih
40 いらっしゃいませ Selamat datang
41 みせてください 見せてください Tolong perlihatkan
42 じゃ Kalau begitu
43 ～をください Tolong ～
44 イタリア Italia
45 スイス Swis
46 フランス Perancis
47 ジャカルタ Jakarta
48 バンコク Bangkok
49 ベルリン Berlin
50 おくじょう 屋上 Lantai atas
51 レストラン Restoran
52 ゆうえんち 遊園地 Tempat hiburan
53 もよおしものかいじょう 催し物会場 Tempat pertunjukan
54 めがね 眼鏡 Kacamata
55 スポーツようひん スポーツ用品 Peralatan olahraga
56 りょこうようひん 旅行用品 Peralatan wisata
57 こどものふく 子供の服 Pakaian anak
58 おもちゃ Mainan
59 ぶんぼうぐ 文房具 Alat tulis
60 かぐ 家具 Perlengkapan rumah
61 しょっき 食器 Peralatan makan
62 でんかせいひん 電化製品 Barang elektronik
63 しんしふく 紳士服 Pakaian pria
64 ふじんふく 婦人服 Pakaian wanita
65 アクセサリー Perhiasan, aksesoris
66 けしょうひん 化粧品 Kosmetik
67 しょくひん 食品 Makanan`,

// Page 4 & 5: BAB 4
`BAB 4
1 おきます 起きます Bangun tidur
2 ねます 寝ます Tidur
3 はたらきます 働きます Bekerja
4 やすみます 休みます Beristirahat , libur
5 べんきょうします 勉強します Belajar
6 おわります 終わります Selesai
7 デパート Departemen store
8 ぎんこう 銀行 Bank
9 ゆうびんきょく 郵便局 Kantor pos
10 としょかん 図書館 Perpustakaan
11 びじゅつかん 美術館 Gedung kesenian
12 いま 今 Sekarang
13 ～じ ～時 Jam , pukul
14 ～ふん／ぶん ～分 Menit
15 はん 半 Setengah
16 なんじ 何時 Jam berapa?
17 なんぷん 何分 Berapa menit ?
18 ごぜん 午前 AM (waktu sebelum jam 12 siang)
19 ごご 午後 PM (waktu setelah jam 12 siang)
20 あさ 朝 Pagi
21 ひる 昼 Siang
22 ばん 晩 Malam
23 よる 夜 Malam
24 おととい 一昨日 2 hari yang lalu , kemarin lusa
25 きのう 昨日 Kemarin
26 きょう 今日 Hari ini
27 あした 明日 Besok
28 あさって 明後日 Besok lusa
29 けさ 今朝 Tadi pagi
30 こんばん 今晩 Malam ini
31 やすみ 休み Istirahat, cuti, libur
32 ひるやすみ 昼休み Istirahat siang
33 しけん 試験 Ujian
34 かいぎ 会議 Rapat
35 えいが 映画 Film
36 まいあさ 毎朝 Setiap pagi
37 まいばん 毎晩 Setiap malam
38 まいにち 毎日 Setiap hari
39 げつようび 月曜日 Hari senin
40 かようび 火曜日 Hari selasa
41 すいようび 水曜日 Hari rabo
42 もくようび 木曜日 Hari kamis
43 きんようび 金曜日 Hari jumat
44 どようび 土曜日 Hari sabtu
45 にちようび 日曜日 Hari minggu
46 なんようび 何曜日 Hari apa?
47 ～から Dari
48 ～まで Sampai
49 ～と～ Dan
50 たいへんですね 大変ですね Berat ya,
51 ばんごう 番号 Nomer
52 なんばん 何番 Nomer berapa?
53 ニューヨーク New york
54 ペキン Beijing
55 ロサンゼルス Los angels
56 ロンドン London
57 けいさつしょ 警察署 Kantor polisi
58 しょうぼうしょ 消防署 Pemadam kebakaran
59 じほう 時報 Pemberitahuan waktu
60 てんきよほう 天気予報 Ramalan cuaca
61 でんわばんごうあんない 電話番号案内 Petunjuk nomor telepon`,

// Page 5 & 6: BAB 5
`BAB 5
1 いきます 行きます Pergi
2 きます 来ます Datang
3 かえります 帰ります Pulang
4 がっこう 学校 Sekolahan
5 スーパー Supermarket
6 えき 駅 Stasiun
7 ひこうき 飛行機 Pesawat terbang
8 ふね 船 Kapal laut
9 でんしゃ 電車 Kereta listrik
10 ちかてつ 地下鉄 Kereta bawah tanah
11 しんかんせん 新幹線 Shinkansen
12 バス Bus
13 タクシー Taksi
14 じてんしゃ 自転車 Sepeda
15 あるいて 歩いて Jalan kaki
16 ひと 人 Orang
17 ともだち 友達 Teman
18 かれ 彼 Dia (laki-laki)
19 かのじょ 彼女 Dia (perempuan)
20 かぞく 家族 Keluarga
21 ひとりで 一人で Sendirian
22 せんしゅう 先週 Minggu lalu
23 こんしゅう 今週 Minggu ini
24 らいしゅう 来週 Minggu depan
25 せんげつ 先月 Bulan lalu
26 こんげつ 今月 Bulan ini
27 らいげつ 来月 Bulan depan
28 きょねん 去年 Tahun lalu
29 ことし 今年 Tahun ini
30 らいねん 来年 Tahun depan
31 ～ねん ～年 Tahun
32 なんねん 何年 Tahun berapa?
33 ～がつ ～月 Bulan
34 なんがつ 何月 Bulan apa?
35 ついたち 一日 Tanggal 1
36 ふつか 二日 Tanggal 2 , 2 hari
37 みっか 三日 Tanggal 3 , 3 hari
38 よっか 四日 Tanggal 4 , 4 hari
39 いつか 五日 Tanggal 5 , 5 hari
40 むいか 六日 Tanggal 6 , 6 hari
41 なのか 七日 Tanggal 7 , 7 hari
42 ようか 八日 Tanggal 8, 8 hari
43 ここのか 九日 Tanggal 9 , 9 hari
44 とおか 十日 Tanggal 10, 10 hari
45 じゅうよっか 十四日 Tanggal 14 , 14 hari
46 はつか 二十日 Tanggal 20 , 20 hari
47 にじゅうよっか 二十四日 Tanggal 24 , 24 hari
48 ～にち ～日 Tanggal , hari
49 なんにち 何日 Tanggal berapa, berapa hari
50 いつ Kapan
51 たんじょうび 誕生日 Hari ulang tahun
52 そうですね Ya begitulah
53 どういたしまして Sama-sama
54 ～ばんせん ～番線 Peron nomor , jalur nomor
55 つぎの 次の Yang berikutnya
56 ふつう 普通 Biasa
57 きゅうこう 急行 Ekspres
58 とっきゅう 特急 Super ekspres
59 しゅくさいじつ 祝祭日 Hari libur nasional
60 がんじつ 元日 Tahun baru
61 せいじんのひ 成人の日 Hari perayaan menjadi dewasa
62 けんこくきねんのひ 建国記念の日 Hari pembangunan nasional
63 しゅんぶんのひ 春分の日 Hari equinox pada musim semi
64 しょうわのひ 昭和の日 Hari showa
65 けんぽうきねんび 憲法記念日 Hari peringatan konstitusi
66 みどりのひ Hari penghijauan
67 こどものひ Hari anak
68 うみのひ 海の日 Hari bahari
69 やまのひ 山の日 Hari gunung
70 けいろうのひ 敬老の日 Hari hormat kepada orang tua
71 しゅうぶんのひ 秋分の日 Hari equinox pada musim gugur
72 たいいくのひ 体育の日 Hari kesehatan olahraga
73 ぶんかのひ 文化の日 Hari kebudayaan
74 きんろうかんしゃのひ 勤労感謝の日 Hari bersyukur untuk pekerjaan
75 てんのうたんじょうび 天皇誕生日 Hari ulang tahun kaisar`,

// Page 7 & 8: BAB 6
`BAB 6
1 たべます 食べます Makan
2 のみます 飲みます Minum
3 すいます 吸います Menghisap / merokok
4 みます 見ます Melihat / menonton
5 ききます 聞きます Mendengar
6 よみます 読みます Membaca
7 かきます 書きます Menulis / menggambar
8 かいます 買います Membeli
9 とります 撮ります Mengambi (foto) / memotret
10 します Melakukan / mengerjakan / berbuat
11 あいます 会います Bertemu
12 ごはん ご飯 Nasi
13 あさごはん 朝ご飯 Makan pagi / sarapan
14 ひるごはん 昼ご飯 Makan siang
15 ばんごはん 晩ご飯 Makan malam
16 パン Roti
17 たまご 卵 Telur
18 にく 肉 Daging
19 さかな 魚 Ikan
20 やさい 野菜 Sayuran
21 くだもの 果物 Buah-buahan
22 みず 水 Air
23 おちゃ お茶 Teh jepang / teh hijau
24 こうちゃ 紅茶 Teh
25 ぎゅうにゅう 牛乳 Susu
26 ジュース Jus
27 ビール Bir
28 おさけ お酒 Minuman keras
29 たばこ Rokok
30 てがみ 手紙 Surat
31 レポート Laporan
32 しゃしん 写真 Foto
33 ビデオ Kaset video
34 みせ 店 Toko
35 にわ 庭 Halaman
36 しゅくだい 宿題 Pekerjaan rumah / PR
37 テニス Tenis
38 サッカー Sepak bola
39 はなみ 花見 Hanami (menikmati bunga sakura)
40 なに 何 Apa
41 いっしょに Bersama-sama
42 ちょっと Sebentar / sedikit
43 いつも Selalu
44 ときどき 時々 Kadang-kadang
45 それから Setelah itu / kemudian
46 ええ Ya
47 いいですね Bagus ya / baik ya
48 わかりました 分かりました Mengerti / baik
49 じゃ、また Ok, sampai jumpa besok
50 メキシコ Meksiko
51 きゅうり Timun
52 トマト Tomat
53 なす Terong
54 まめ Kacang-kacangan
55 キャベツ Kol
56 ねぎ Daun bawang
57 はくさい Sawi
58 ほうれんそう Bayam
59 レタス Letas
60 じゃがいも Kentang
61 だいこん Lobak
62 たまねぎ Bawang
63 にんじん Wortel
64 いちご Stroberi
65 もも Buah peach
66 すいか Semangka
67 ぶどう Anggur
68 なし Pir
69 かき Kesemek
70 みかん Jeruk
71 りんご Apel
72 バナナ Pisang
73 ぎゅうにく Daging sapi
74 とりにく Daging ayam
75 ぶたにく Daging babi
76 ソーセージ Sosis
77 ハム Ham
78 あじ Ikan mackerel
79 いわし Ikan sarden
80 さば Ikan kembung
81 さんま Ikan sauri pasifik
82 さけ Ikan salmon
83 まぐろ Ikan tuna
84 たい Ikan kakap
85 たら Ikan gabus
86 えび Udang
87 かに Kepiting
88 いか Cumi-cumi
89 たこ Gurita
90 こめ Beras`,

// Page 9 & 10: BAB 7
`BAB 7
1 きります 切ります Memotong / menggunting
2 おくります 送ります Mengirim
3 あげます Memberikan
4 もらいます Menerima / mendapatkan
5 かします 貸します Meminjamkan / menyewakan
6 かります 借ります Meminjam / menyewa
7 おしえます 教えます Mengajar
8 ならいます 習います Belajar (kepada)
9 かけます Menelpon
10 て 手 Tangan
11 はし Sumpit
12 スプーン Sendok
13 ナイフ Pisau
14 フォーク Garpu
15 はさみ Gunting
16 パソコン Laptop
17 ケータイ HP
18 メール Email
19 ねんがじょう 年賀状 Kartu tahun baru
20 パンチ Pelubang kertas
21 ホッチキス Stapler
22 セロテープ Selotip
23 けしゴム 消しゴム Penghapus karet
24 かみ 紙 Kertas
25 はな 花 Bunga
26 シャツ Kemeja
27 プレゼント Hadiah / kado
28 にもつ 荷物 Barang
29 おかね お金 Uang
30 きっぷ 切符 Karcis
31 クリスマス Natal
32 ちち 父 Ayah
33 はは 母 Ibu
34 おとうさん お父さん Ayah orang lain
35 おかあさん お母さん Ibu orang lain
36 もう Sudah
37 まだ Belum
38 これから Mulai dari sekarang
39 すてきですね Bagus ya / indah ya
40 いらっしゃい Selamat datang
41 どうぞおあがりください Silakan masuk
42 しつれいします 失礼します Permisi
43 ～いかがですか Bagaimana ? (menawarkan sesuatu kepada orang)
44 いただきます Selamat makan
45 ごちそうさまでした Terima kasih atas hidangannya
46 スペイン Spanyol
47 かぞく 家族 Keluarga
48 そぼ 祖母 Nenek
49 そふ 祖父 Kakek
50 そふぼ 祖父母 Kakek nenek
51 りょうしん 両親 Orang tua
52 いもうと 妹 Adik perempuan
53 おとうと 弟 Adik laki-laki
54 あね 姉 Kakak perempuan
55 あに 兄 Kakak laki-laki
56 きょうだい 兄弟 Saudara kandung
57 つま 妻 Istri
58 おっと 夫 Suami
59 ふうふ 夫婦 Pasangan suami istri
60 むすめ 娘 Anak perempuan
61 むすこ 息子 Anak laki-laki
62 こども 子供 Anak
63 おばあさん Nenek (orang lain)
64 おじいさん Kakek (orang lain)
65 ごりょうしん Orang tua (orang lain)
66 いもうとさん Adik perempuan (orang lain)
67 おとうとさん Adik laki-laki (orang lain)
68 おねえさん Kakak perempuan (orang lain)
69 おにいさん Kakak laki-laki (orang lain)
70 ごきょうだい Saudara kandung (orang lain)
71 おくさん Istri (orang lain)
72 ごふうふ Pasangan suami istri (orang lain)
73 むすめさん Anak perempuan (orang lain)
74 むすこさん Anak laki-laki (orang lain)
75 おこさん Anak (orang lain)`,

// Page 10 & 11: BAB 8
`BAB 8
1 ハンサム Tampan / gagah / ganteng
2 きれい Cantik / bersih
3 しずか 静香 Sunyi / tenang
4 にぎやか Ramai
5 ゆうめい 有名 Terkenal
6 しんせつ 新設 Baik hati
7 げんき 元気 Sehat
8 ひま 暇 Senggang
9 べんり 便利 Praktis
10 すてき Bagus
11 おおきい 大きい Besar
12 ちいさい 小さい Kecil
13 あたらしい 新しい Baru
14 ふるい 古い Lama / tua
15 いい（よい） Baik / bagus
16 わるい 悪い Jelek
17 あつい 暑い、熱い Panas
18 さむい 寒い Dingin suhu
19 つめたい 冷たい Dingin benda
20 むずかしい 難しい Sulit / susah
21 やさしい 易しい Mudah / gampang
22 たかい 高い Mahal / tinggi
23 やすい 安い Murah
24 ひくい 低い Rendah
25 おもしろい Menarik
26 おいしい Enak
27 いそがしい 忙しい Sibuk
28 たのしい 楽しい Senang
29 しろい 白い Putih
30 くろい 黒い Hitam
31 あかい 赤い Merah
32 あおい 青い Biru
33 さくら 桜 Sakura
34 やま 山 Gunung
35 まち 町 Kota
36 たべもの 食べ物 Makanan
37 ところ 所 Tempat
38 りょう 寮 Asrama
39 レストラン Restoran
40 せいかつ 生活 Kehidupan
41 しごと 仕事 Pekerjaan
42 どう Bagaimana?
43 どんな～ Yang bagaimana ?
44 とても Sangat / ~sekali
45 あまり Tidak begitu ~ / kurang begitu ~
46 そして Kemudian
47 ～が～ Tetapi
48 おげんきですか お元気ですか Apa kabar ?
49 そうですね Bagaimana ya?
50 ～もういっぱいいかがですか Mau nambah secangkir lagi ?
51 （いいえ）けっこうです Cukup
52 そろそろしつれいします そろそろ失礼します Maaf saya mau pamit dulu
53 いいえ Sama-sama
54 またいらっしゃってください Silakan datang lagi
55 シャンハイ Shanghai
56 みどり Hijau
57 むらさき Ungu
58 きいろい Kuning
59 ちゃいろい coklat
60 ピンク Merah muda
61 オレンジ Oranye
62 グレー Abu-abu
63 ベージュ krem
64 はる 春 Musim semi
65 なつ 夏 Musim panas
66 あき 秋 Musim gugur
67 ふゆ 冬 Musim dingin`,

// Page 12 & 13: BAB 9
`BAB 9
1 わかります 分かります Mengerti
2 あります Ada / mempunyai
3 すき 好きな Suka , gemar
4 きらい 嫌いな Benci
5 じょうず 上手な Pandai , pintar
6 へた 下手な Tidak pandai , tidak pintar , bodoh
7 のみもの 飲み物 Minuman
8 りょうり 料理 Masakan
9 スポーツ Olahraga
10 やきゅう 野球 Baseball
11 ダンス Dansa
12 りょこう 旅行 Tamasya
13 おんがく 音楽 Musik
14 うた 歌 Lagu
15 クラシック Klasik
16 ジャズ Jaz
17 コンサート Konser
18 カラオケ Karaoke
19 かぶき 歌舞伎 Kabuki (drama tradisional jepang)
20 え 絵 Gambar
21 じ 字 Huruf
22 かんじ 漢字 Kanji
23 ひらがな Hiragana
24 かたかな Katakana
25 ローマじ Huruf latin
26 こまかいおかね 細かいお金 Uang kecil, receh
27 チケット Tiket
28 じかん 時間 Waktu
29 ようじ 用事 Urusan
30 やくそく 約束 Janji
31 アルバイト Kerja paruh waktu
32 ごしゅじん ご主人 Suami orang lain
33 おっと／しゅじん 夫／主人 Suami
34 おくさん 奥さん Istri orang lain
35 つま／かない 妻／家内 Istri
36 こども 子供 Anak
37 よく Dengan baik
38 だいたい Kira-kira
39 たくさん Banyak
40 すこし 少し Sedikit
41 ぜんぜん 全然 Sama sekali
42 はやく 早く／速く Dengan Cepat
43 ～から Karena
44 どうして Kenapa
45 かしてください 貸してください Tolong pinjamkan
46 いいですよ Boleh
47 ざんねんです 残念です Sayang sekali
48 いっしょにいかがですか Bagaimana kalau bersama-sama
49 ～ちょっと。。。。 Maaf, saya tidak bisa
50 だめですか Tidak bisa ya / tidak boleh ya
51 またこんどおねがいします また今度お願いします Maaf lain kali saja
52 ポップス Pop
53 ロック Rock
54 ラテン Musik latin
55 みんよう 民謡 Musik rakyat / nyanyian daerah
56 えんか 演歌 Lagu tradisional jepang populer
57 ミュージカル Drama musikal
58 オペラ Opera
59 ホラー Film horor
60 アニメ Film kartun , animasi
61 ドキュメンタリー Film dokumentasi
62 れんあい 恋愛 Film percintaan
63 ミステリー Film misteri
64 ぶんげい 文芸 Film kesusastraan
65 せんそう 戦争 Film peperangan
66 アクション Film action
67 きげき 喜劇 Film komedi
68 ソフトボール Softball
69 サッカー Sepak bola
70 ラグビー Rugby
71 バレーボール Voli
72 テニス Tenis
73 ボウリング Bowling
74 スキー Sky
75 スケート Skate
76 たっきゅう／ピンポン 卓球 Pingpong
77 すもう 相撲 Sumo
78 じゅうどう 柔道 Judo
79 けんどう 剣道 Kendo
80 すいえい 水泳 Renang`,

// Page 13 & 14: BAB 10
`BAB 10
1 あります Ada (benda mati)
2 います Ada (benda hidup)
3 いろいろ Berbagai / macam-macam
4 おとこのひと 男の人 Orang laki-laki
5 おんなのひと 女の人 Orang perempuan
6 おとこのこ 男の子 Anak laki-laki
7 おんなのこ 女の子 Anak perempuan
8 いぬ 犬 Anjing
9 ねこ 猫 Kucing
10 パンダ Panda
11 ぞう 像 Gajah
12 き 木 Pohon
13 もの 物 Barang
14 でんち 電池 Baterai
15 はこ 箱 Kotak
16 スイッチ Saklar
17 れいぞうこ 冷蔵庫 Kulkas
18 テーブル Meja makan
19 ベッド Tempat tidur
20 たな 棚 Lemari
21 ドア Pintu
22 まど 窓 Jendela
23 ポスト Kotak surat
24 ビル Gedung
25 ＡＴＭ Atm
26 コンビニ Toko 24 jam
27 こうえん 公園 Taman
28 きっさてん 喫茶店 Coffe shop / cafe
29 ～や ～屋 Toko ~
30 のりば 乗り場 Tempat naik
31 けん 県 Prefektur
32 うえ 上 Atas
33 した 下 Bawah
34 まえ 前 Depan
35 うしろ 後ろ Belakang
36 みぎ 右 Kanan
37 ひだり 左 Kiri
38 なか 中 Dalam
39 そと 外 Luar
40 となり 隣 Samping / sebelah
41 ちかく 近く Dekat
42 あいだ 間 Antara
43 どうもすみません Maaf / terima kasih banyak
44 ナンプラー Kecap ikan
45 コーナー Tempat / bagian penjualan
46 いちばんした 一番下 Paling bawah
47 げんかん 玄関 Pintu masuk
48 ふろば 風呂場 Kamar mandi
49 せんめんじょ 洗面所 Tempat cuci tangan
50 だいどころ 台所 Dapur
51 しょくどう 食堂 Kantin / ruang makan
52 いま 居間 Ruang tamu
53 しんしつ 寝室 Kamar tidur
54 ろうか 廊下 Koridor
55 ベランダ teras`
];

// Helper to parse blocks
function parseChapterBlock(text) {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  let currentChapter = 1;
  const items = [];

  for (const line of lines) {
    const babMatch = line.match(/^BAB\s+(\d+)/i);
    if (babMatch) {
      currentChapter = parseInt(babMatch[1], 10);
      continue;
    }

    // Lines are like:
    // 1 わたし 私 Saya
    // 2 あなた Kamu
    const match = line.match(/^(\d+)\s+(.+)$/);
    if (match) {
      const no = parseInt(match[1], 10);
      const rest = match[2].trim();
      const tokens = rest.split(/\s+/);
      
      const japanese = tokens[0];
      let kanji = undefined;
      let indonesian = '';

      if (tokens.length >= 3 && !/^[A-Za-z(]/.test(tokens[1])) {
        // tokens[1] is kanji (Japanese characters)
        kanji = tokens[1];
        indonesian = tokens.slice(2).join(' ');
      } else {
        indonesian = tokens.slice(1).join(' ');
      }

      items.push({
        no,
        chapter: currentChapter,
        japanese,
        kanji: kanji || undefined,
        indonesian: indonesian.trim()
      });
    }
  }

  return items;
}

let allParsed = [];
for (const p of ocrPages) {
  allParsed = allParsed.concat(parseChapterBlock(p));
}

console.log('Parsed items count for first 10 chapters:', allParsed.length);
fs.writeFileSync(path.join(__dirname, 'test_parsed.json'), JSON.stringify(allParsed, null, 2));
