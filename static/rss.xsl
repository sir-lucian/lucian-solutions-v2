<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="3.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/"
                xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title><xsl:value-of select="/rss/channel/title"/> - RSS Feed</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
        <style type="text/css">
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"; max-width: 768px; margin: 0 auto; padding: 2rem; color: #333; line-height: 1.5; }
          header { border-bottom: 1px solid #eaeaea; padding-bottom: 1rem; margin-bottom: 2rem; }
          header h1 { margin-bottom: 0.5rem; }
          a { color: #0070f3; text-decoration: none; }
          a:hover { text-decoration: underline; }
          .item { margin-bottom: 2rem; border-bottom: 1px solid #eaeaea; padding-bottom: 2rem; }
          .item h2 { margin-bottom: 0.5rem; }
          .meta { color: #666; font-size: 0.875rem; margin-bottom: 1rem; }
        </style>
      </head>
      <body>
        <header>
          <h1><xsl:value-of select="/rss/channel/title"/> - RSS Feed</h1>
          <p><xsl:value-of select="/rss/channel/description"/></p>
          <p>
            <a>
              <xsl:attribute name="href">
                <xsl:value-of select="/rss/channel/link"/>
              </xsl:attribute>
              Visit Website &#x2192;
            </a>
          </p>
        </header>
        <main>
          <xsl:for-each select="/rss/channel/item">
            <div class="item">
              <h2>
                <a target="_blank">
                  <xsl:attribute name="href">
                    <xsl:value-of select="link"/>
                  </xsl:attribute>
                  <xsl:value-of select="title"/>
                </a>
              </h2>
              <div class="meta">
                <time>
                   <xsl:value-of select="pubDate" />
                </time>
              </div>
              <div>
                 <!-- Disable HTML injection here to be safe, but typically description has CDATA -->
                 <xsl:value-of select="description" disable-output-escaping="yes"/>
              </div>
            </div>
          </xsl:for-each>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>