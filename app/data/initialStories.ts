export interface Story {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  mood: "romantis" | "tenang" | "ajaib" | "lucu";
  duration: number; // in minutes
  createdAt: string;
}

export const initialStories: Story[] = [
  {
    id: "1",
    title: "Nyanyian Bintang Kejora",
    excerpt: "Kisah tentang bintang terkecil yang bertugas menyanyikan lagu pengantar tidur untuk bumi.",
    content: "Di ujung langit malam yang paling tinggi, hiduplah sebutir bintang kecil bernama Kejora. Kejora adalah bintang yang paling redup di antara saudara-saudaranya. Ketika bintang-bintang lain bersinar terang benderang memamerkan cahaya keemasan mereka, Kejora hanya memancarkan sinar putih keperakan yang sangat lembut.\n\nNamun, Kejora memiliki tugas yang sangat istimewa. Setiap malam, ketika bulan mulai meninggi dan bumi mulai bersiap untuk tidur, Kejora akan menyanyikan melodi malam yang sangat sunyi. Suaranya tidak terdengar oleh telinga manusia, melainkan merambat melalui hembusan angin malam dan mendarat langsung di hati setiap makhluk yang sedang memejamkan mata.\n\nSuatu malam, Kejora merasa sedih karena awan mendung sangat tebal menutupi langit. Dia takut melodi tidurnya tidak sampai ke bumi, dan orang-orang yang dia sayangi akan mengalami mimpi buruk. Dengan segenap kekuatannya, Kejora bernyanyi lebih lembut dan tulus dari biasanya. Dia melantunkan melodi tentang ketenangan, tentang malam yang akan selalu menjaga mimpi indah.\n\nKeajaiban pun terjadi. Ketulusan lagu Kejora membuat awan mendung perlahan-lahan menyingkir, membelah diri untuk memberikan jalan bagi cahaya peraknya yang lembut. Malam itu, bumi tertidur dengan sangat lelap, ditemani oleh kehangatan sinar perak Kejora.\n\nSama seperti Kejora, kau tidak perlu menjadi yang paling terang di dunia untuk menjadi berarti. Cahayamu yang lembut dan tenang sudah lebih dari cukup untuk menenangkan hatiku setiap hari. Selamat tidur, bintang kecilku.",
    mood: "tenang",
    duration: 3,
    createdAt: "2026-07-04"
  },
  {
    id: "2",
    title: "Pangeran Awan dan Kastil Kapas",
    excerpt: "Petualangan melintasi langit untuk mencari warna mimpi yang paling indah.",
    content: "Dahulu kala, di sebuah kerajaan yang melayang di atas awan, hiduplah seorang Pangeran Awan bernama Nimbus. Nimbus memiliki tugas untuk mengecat langit setiap sore menjelang malam. Dia menggunakan kuas ajaib dari bulu angsa langit dan cat warna-warni yang dia kumpulkan dari bias pelangi.\n\nNimbus sangat suka membuat perpaduan warna jingga hangat, merah muda lembut, dan ungu malam. Namun, Nimbus menyadari bahwa ada satu warna yang paling disukai oleh orang-orang di bumi yang sedang jatuh cinta—yaitu warna 'Mimpi Indah'. Warna ini adalah perpaduan antara cahaya bulan keemasan dan kabut malam yang tenang.\n\nSuatu hari, Nimbus kehilangan kuas ajaibnya saat bermain di Kastil Kapas. Tanpa kuas itu, langit terancam menjadi abu-abu gelap dan dingin. Nimbus kemudian dibantu oleh seekor burung hantu bijaksana bernama Luna. Luna memberi tahu Nimbus bahwa kuas sejati bukanlah kuas bulu angsa, melainkan perasaan yang dituangkan dari dalam hati.\n\nNimbus memejamkan mata, memikirkan senyuman seseorang yang paling berharga di bumi. Dia melambaikan tangannya ke udara, merajut angin malam, dan seketika langit terlukis dengan warna merah muda keunguan yang sangat indah, bahkan lebih indah daripada lukisan kuas ajaibnya. Kastil Kapas pun kembali bersinar lembut.\n\nCerita ini mengingatkanku bahwa seberapa pun gelapnya hari yang telah kita lalui, malam akan selalu melukis mimpi yang indah untuk kita. Dan di setiap warna langit malam yang indah, selalu ada doa hangatku untuk tidurmu.",
    mood: "ajaib",
    duration: 4,
    createdAt: "2026-07-04"
  },
  {
    id: "3",
    title: "Kucing Bulan dan Benang Rajut Emas",
    excerpt: "Kisah lucu tentang seekor kucing kecil yang mengira bulan adalah bola benang rajut raksasa.",
    content: "Di sebuah desa kecil di dekat hutan, hiduplah seekor anak kucing berbulu putih bersih bernama Miko. Miko adalah kucing yang sangat aktif dan penuh rasa ingin tahu. Hobi terbesarnya adalah mengejar apa saja yang bergerak: daun kering, bayangan, dan terutama, bola benang rajut.\n\nSuatu malam yang cerah, Miko melihat ke langit luar jendela. Matanya membulat besar ketika melihat bulan purnama yang bersinar bulat sempurna. Bagi Miko, itu bukan bulan. Itu adalah bola benang rajut emas raksasa milik peri langit yang sengaja ditinggalkan!\n\n'Aku harus menangkap bola benang itu!' pikir Miko dengan penuh semangat.\n\nMiko melompat ke atas pagar kayu, lalu memanjat pohon apel yang paling tinggi di halaman. Dia merentangkan cakarnya tinggi-tinggi ke langit, mencoba menggapai bulan. Namun tentu saja, bulan tetap berada sangat jauh di atas sana. Miko mencobanya berulang kali hingga dia kelelahan dan akhirnya tertidur di dahan pohon apel dengan posisi mendengkur pelan.\n\nDalam tidurnya, peri bulan yang melihat tingkah lucu Miko tersenyum. Sang peri mengirimkan seberkas cahaya keemasan lembut yang menyelimuti Miko seperti selimut hangat. Ketika Miko terbangun keesokan paginya, dia menemukan sebuah bola benang rajut kuning keemasan di dekatnya, seolah-olah bulan telah memberikan sedikit bagian darinya untuk Miko.\n\nMiko menyadari bahwa beberapa hal yang indah memang tidak perlu kita miliki secara nyata untuk bisa kita nikmati kehangatannya. Cukup dengan menatapnya dari jauh, hati kita sudah bisa merasa tenang. Seperti dirimu, yang kehadirannya selalu memberikan kehangatan di setiap malamku.",
    mood: "lucu",
    duration: 3,
    createdAt: "2026-07-04"
  },
  {
    id: "4",
    title: "Sepasang Lilin di Jendela Kamar",
    excerpt: "Sebuah dongeng romantis tentang dua lilin kecil yang saling menerangi di tengah malam yang dingin.",
    content: "Pada sebuah musim dingin yang menggigit, di sebuah jendela toko kayu tua, berdirilah dua lilin kecil berdampingan. Lilin pertama berwarna putih salju, namanya Alba. Lilin kedua berwarna abu-abu arang lembut, namanya Cinder.\n\nAlba memiliki sumbu yang lurus dan tegak, memancarkan cahaya yang putih bersih. Sementara Cinder memiliki sumbu yang sedikit melengkung, memancarkan cahaya kekuningan yang hangat. Toko kayu itu sangat sepi, dan setiap malam suhu di dalam ruangan akan turun drastis.\n\nSetiap kali angin dingin menyelinap melalui celah jendela, Alba akan condong ke arah Cinder untuk melindunginya dari tiupan angin agar api Cinder tidak padam. Dan sebaliknya, saat Alba merasa kedinginan dan cahayanya mulai meredup, Cinder akan membagikan kehangatan cahayanya agar Alba tetap menyala dengan terang.\n\nMereka berdua berjanji untuk tidak pernah membiarkan satu sama lain padam sendirian di tengah malam yang gelap. 'Selama kita saling menerangi, malam yang paling dingin pun akan terasa hangat,' bisik Cinder kepada Alba.\n\nSang pemilik toko yang melihat keindahan cahaya kedua lilin itu akhirnya memindahkan mereka ke atas meja kayu di kamarnya, membiarkan mereka menyala bersama-sama menyinari malam-malamnya yang sunyi hingga musim dingin berganti menjadi musim semi.\n\nKita mungkin sering menghadapi malam-malam yang melelahkan atau dingin karena aktivitas seharian. Tapi ketahuilah, aku akan selalu ada di sini, menjadi lilin yang menemanimu, melindungimu dari angin malam, dan memastikan tidurmu selalu dipenuhi dengan kehangatan cinta kita. Selamat tidur, sayangku.",
    mood: "romantis",
    duration: 4,
    createdAt: "2026-07-04"
  }
];
