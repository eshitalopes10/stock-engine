package com.stockanalyzer;

import com.stockanalyzer.dto.Freshness;
import com.stockanalyzer.provider.SampleMarketDataProvider;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class SampleProviderTest {
    private final SampleMarketDataProvider p = new SampleMarketDataProvider();

    @Test void quotesAreAlwaysLabelledSample() {
        assertEquals(Freshness.SAMPLE, p.quote("TCS").orElseThrow().freshness());
    }
    @Test void historyIsDeterministic() {
        assertEquals(p.history("INFY", 30), p.history("INFY", 30));
    }
    @Test void searchMatchesNameOrSymbol() {
        assertEquals(1, p.search("hdfc").size());
    }
}
