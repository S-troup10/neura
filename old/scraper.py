import scrapy
from scrapy.crawler import CrawlerProcess
import sys
import old.output as output  # Your module to handle results

if len(sys.argv) > 1:
    search_term = sys.argv[1]
else:
    print("No search term provided.")
    sys.exit(1)

class LeadSpider(scrapy.Spider):
    name = "leadSpider"
    custom_settings = {
        "LOG_LEVEL": "ERROR",
        "USER_AGENT": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
    }

    def __init__(self):
        self.search = search_term

    def start_requests(self):
        formatted = self.search.replace(" ", "+")
        urls = [
            f'https://www.yellowpages.com/search?search_terms={formatted}%5C&geo_location_terms=Sydney%2C+ND'
            f"https://www.trustpilot.com/search?query={formatted}"
        ]

        for url in urls:
            yield scrapy.Request(
                url=url,
                callback=self.parse_yellowpages if "yellowpages" in url else self.parse_trustpilot,
                headers={"User-Agent": self.custom_settings["USER_AGENT"]}
            )

    def parse_yellowpages(self, response):
        listings = response.css("div.result")
        for biz in listings:
            name = biz.css("a.business-name span::text").get()
            phone = biz.css("div.phones.phone.primary::text").get()
            email = None  # Yellow Pages typically hides email unless you click through

            if name or phone:
                output.send({
                    "source": "YellowPages",
                    "name": name.strip() if name else None,
                    "phone": phone.strip() if phone else None,
                    "email": email,
                    "search_term": self.search
                })

    def parse_trustpilot(self, response):
        blocks = response.css('div.styles_cardWrapper__LcCPA')
        for block in blocks:
            name = block.css('span.styles_displayName__1Y2r3::text').get()
            profile_link = block.css('a.styles_link__3QmHY::attr(href)').get()

            if profile_link:
                yield response.follow(profile_link, self.parse_trustpilot_profile, meta={'name': name})

    def parse_trustpilot_profile(self, response):
        name = response.meta.get('name')
        email = response.xpath("//a[contains(@href,'mailto:')]/@href").get()
        phone = response.xpath("//a[contains(@href,'tel:')]/@href").get()

        output.send({
            "source": "Trustpilot",
            "name": name,
            "email": email.replace("mailto:", "") if email else None,
            "phone": phone.replace("tel:", "") if phone else None,
            "search_term": self.search
        })

# Run spider
process = CrawlerProcess()
process.crawl(LeadSpider)
process.start()
