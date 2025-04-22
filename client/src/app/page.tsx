import Notes from "../components/Notes";
import News from "../components/News";
import Header from "../components/Header";
import Weather from "../components/Weather";
import Stocks from "../components/Stocks";
const api_key = process.env.NY_TIMES_API_KEY

export default async function Home() {
  let news = [];
  try {
    const res = await fetch(`https://api.nytimes.com/svc/topstories/v2/us.json?api-key=${api_key}`)
    if (!res.ok) {
      throw new Error(`Fetch failed with status ${res.status}`);
    }
    const data = await res.json(); // Parse the JSON response
    news = data.results;
    // console.log(news);
  } catch (err){
    console.log(err)
  }


  return (
    <main className="h-screen w-screen flex flex-col h-lg:overflow-hidden text-black">
      <Header />
      {/* Responsive layout: col on mobile, row on lg screens */}
      <div className="flex flex-col lg:flex-row flex-1 ">
        <section className="lg:basis-3/4 flex flex-col justify-start ">
          <div className="flex flex-col md:flex-row h-auto lg:h-1/2 mb-0">
            <Weather />
            <Stocks />
          </div>
          <News news={news} />
        </section>
        <section className="lg:basis-2/4 flex justify-end">
          <Notes />
        </section>
      </div>
    </main>
  );
}
