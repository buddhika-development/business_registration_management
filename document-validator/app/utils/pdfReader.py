from pypdf import PdfReader

def pdfContentScraper(file) -> str | None:
    document_content = ""

    try:

        document = PdfReader(file)
        pageCount = len(document.pages)

        for i in range(pageCount):
            page = document.pages[i]
            page_content = page.extract_text()
            document_content += page_content

        return document_content

    except Exception as e:
        print("Something went wrong. In document reading process.")
        return None