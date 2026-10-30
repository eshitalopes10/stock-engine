package com.stockanalyzer.provider;

import com.stockanalyzer.dto.*;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.time.*;
import java.util.*;

/**
 * PLACEHOLDER provider so the UI has something to render. Prices are generated, not real,
 * and every quote is labelled Freshness.SAMPLE. Replace with a licensed provider.
 */
@Component
@ConditionalOnProperty(name = "app.data.provider", havingValue = "sample", matchIfMissing = true)
public class SampleMarketDataProvider implements MarketDataProvider {

    private record Seed(CompanyProfile profile, double base, double marketCapCr, Double pe) {}

    private static final List<Seed> SEEDS = List.of(
        new Seed(new CompanyProfile("RELIANCE", "Reliance Industries", "Energy & Conglomerate", "CONGLOMERATE"), 1380, 1_870_000, 24.1),
        new Seed(new CompanyProfile("TCS", "Tata Consultancy Services", "Information Technology", "IT_SERVICES"), 3150, 1_140_000, 25.3),
        new Seed(new CompanyProfile("HDFCBANK", "HDFC Bank", "Banking", "BANK"), 1010, 1_550_000, 18.9),
        new Seed(new CompanyProfile("INFY", "Infosys", "Information Technology", "IT_SERVICES"), 1520, 630_000, 23.2),
        new Seed(new CompanyProfile("ITC", "ITC", "FMCG", "CONSUMER"), 415, 520_000, 26.0),
        new Seed(new CompanyProfile("LT", "Larsen & Toubro", "Capital Goods", "MANUFACTURING"), 3650, 502_000, 31.4),
        new Seed(new CompanyProfile("SUNPHARMA", "Sun Pharmaceutical", "Pharmaceuticals", "PHARMA"), 1680, 403_000, 34.8),
        new Seed(new CompanyProfile("ICICIBANK", "ICICI Bank", "Banking", "BANK"), 1390, 990_000, 18.1)
    );

    @Override public String name() { return "SampleProvider"; }

    @Override
    public List<CompanyProfile> search(String query) {
        String q = query == null ? "" : query.trim().toLowerCase();
        return SEEDS.stream().map(Seed::profile)
            .filter(p -> q.isEmpty() || p.symbol().toLowerCase().contains(q) || p.name().toLowerCase().contains(q))
            .toList();
    }

    @Override
    public Optional<CompanyProfile> profile(String symbol) {
        return seed(symbol).map(Seed::profile);
    }

    @Override
    public Optional<Quote> quote(String symbol) {
        return seed(symbol).map(s -> {
            List<Candle> c = history(symbol, 5);
            Candle last = c.get(c.size() - 1), prev = c.get(c.size() - 2);
            double change = last.close() - prev.close();
            return new Quote(symbol, last.close(), round(change), round(change / prev.close() * 100),
                last.volume(), s.marketCapCr(), s.pe(), Freshness.SAMPLE, name(), Instant.now());
        });
    }

    @Override
    public List<Candle> history(String symbol, int days) {
        Seed s = seed(symbol).orElseThrow();
        // Deterministic walk anchored on today so repeat calls agree with each other.
        Random r = new Random(symbol.hashCode());
        int total = 400;
        double[] closes = new double[total];
        double price = s.base();
        for (int i = 0; i < total; i++) {
            price *= 1 + (r.nextGaussian() * 0.011 + 0.0003);
            closes[i] = price;
        }
        List<LocalDate> dates = new ArrayList<>();
        LocalDate d = LocalDate.now();
        while (dates.size() < total) {
            if (d.getDayOfWeek() != DayOfWeek.SATURDAY && d.getDayOfWeek() != DayOfWeek.SUNDAY) dates.add(0, d);
            d = d.minusDays(1);
        }
        List<Candle> out = new ArrayList<>();
        int from = Math.max(1, total - Math.min(days, total - 1));
        for (int i = from; i < total; i++) {
            double open = closes[i - 1], close = closes[i];
            double high = Math.max(open, close) * (1 + r.nextDouble() * 0.006);
            double low = Math.min(open, close) * (1 - r.nextDouble() * 0.006);
            out.add(new Candle(dates.get(i), round(open), round(high), round(low), round(close),
                1_000_000L + (long) (r.nextDouble() * 9_000_000)));
        }
        return out;
    }

    private Optional<Seed> seed(String symbol) {
        return SEEDS.stream().filter(s -> s.profile().symbol().equalsIgnoreCase(symbol)).findFirst();
    }

    private static double round(double v) { return Math.round(v * 100.0) / 100.0; }
}
