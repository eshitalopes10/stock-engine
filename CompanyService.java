package com.stockanalyzer.service;

import com.stockanalyzer.dto.*;
import com.stockanalyzer.exception.NotFoundException;
import com.stockanalyzer.provider.MarketDataProvider;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CompanyService {
    private final MarketDataProvider provider;

    public CompanyService(MarketDataProvider provider) { this.provider = provider; }

    public List<CompanySummary> search(String q) {
        return provider.search(q).stream().map(p -> new CompanySummary(
            p,
            provider.quote(p.symbol()).orElse(null),
            provider.history(p.symbol(), 30).stream().map(Candle::close).toList()
        )).toList();
    }

    public CompanySummary get(String symbol) {
        CompanyProfile p = provider.profile(symbol).orElseThrow(() -> new NotFoundException("Company " + symbol));
        return new CompanySummary(p, provider.quote(symbol).orElse(null), List.of());
    }

    public List<Candle> prices(String symbol, int days) {
        provider.profile(symbol).orElseThrow(() -> new NotFoundException("Company " + symbol));
        return provider.history(symbol, days);
    }
}
