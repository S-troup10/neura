import scrapy
from scrapy.crawler import CrawlerProcess
import sys
import old.output as output  # Ensure output.py exists

if len(sys.argv) > 1:
    search_term = sys.argv[1]
else:
    print("No search term provided.")
    sys.exit(1)

class BasicSpider(scrapy.Spider):
    name = "basicSpider"
    custom_settings = {
        "LOG_LEVEL": "ERROR",
        "USER_AGENT": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
    }

    def __init__(self):
        self.selectors = {
            'amazon': {
                'title': 'span#productTitle::text',
                'link': 'a.a-link-normal.s-no-outline::attr(href)',  
                'price': 'span.a-price-whole::text',
                'image': 'img#landingImage::attr(src)'
            },
            'ebay': {
                'title': 'h1.x-item-title__mainTitle span::text',
                'link': 'a.s-item__link::attr(href)',
                'price': '.x-price-primary span::text',
                'image': '.ux-image-carousel-item.image-treatment.active.image img::attr(src)'

            }
        }

        self.search = search_term
        self.unique_products = set()

    def start_requests(self):
        platforms = [
            {'platform': 'amazon', 'url': f"https://www.amazon.com/s?k={self.search.replace(' ', '+')}"},
            {'platform': 'ebay', 'url': f"https://www.ebay.com/sch/i.html?_nkw={self.search.replace(' ', '+')}"}
        ]

        for site in platforms:
            yield scrapy.Request(
                url=site['url'],
                callback=self.GetProducts,
                headers={"User-Agent": self.custom_settings["USER_AGENT"]},
                meta={'platform': site['platform'], 'count': 0}  
            )

    def GetProducts(self, response):
        platform = response.meta['platform']
        count = response.meta['count']
        products = response.css(self.selectors[platform]['link']).getall()
        
        for product in products:
            if count >= 100:  
                break
            
            full_url = response.urljoin(product)  
            
            if ("ebay.com/itm/" in full_url or "/dp/" in full_url) and full_url not in self.unique_products:
                self.unique_products.add(full_url)
                count += 1
                yield scrapy.Request(
                    url=full_url,
                    callback=self.GetProductDetails,
                    headers={"User-Agent": self.custom_settings["USER_AGENT"]},
                    meta={'platform': platform}  
                )

    def GetProductDetails(self, response):
        platform = response.meta['platform']
        product_title = response.css(self.selectors[platform]['title']).get()
        product_price = response.css(self.selectors[platform]['price']).get()
        product_image = response.css(self.selectors[platform]['image']).get()

        
        if product_title:
                
            product_title = product_title.strip() if product_title else "No title available"
            product_price = product_price.strip() if product_price else "No price available"
            
            
            #remove each
            if '/ea' in product_price:
                product_price = product_price.split('/ea')[0]
                
            if ' ' in product_price:
                product_price = product_price.split(' ')[1]
                
            if '$$' in product_price:
                product_price = product_price.replace('$$', '')
                
                
            product_title = output.summarize_title(product_title, 6)

            record = {
                "platform": platform,
                "title": product_title,
                "price": product_price,
                "url": response.url,
                "img": product_image,
                "search_term": self.search
            }
            
            output.send(record)

    def closed(self, reason):
        print(f"Crawling finished ({reason}).")

# Run Scrapy Crawler
process = CrawlerProcess()
process.crawl(BasicSpider)
process.start()
