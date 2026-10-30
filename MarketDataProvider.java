package com.stockanalyzer.provider;

import com.stockanalyzer.dto.*;
import java.util.List;
import java.util.Optional;

/** Every data source (NSE vendor, broker API, sample) implements this. Services never know which one is active. */
public interface MarketDataProvider {
    String name();
    List<CompanyProfile> search(String query);
    Optional<CompanyProfile> profile(String symbol);
    Optional<Quote> quote(String symbol);
    List<Candle> history(String symbol, int days);
}
