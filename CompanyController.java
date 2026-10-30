package com.stockanalyzer.controller;

import com.stockanalyzer.dto.*;
import com.stockanalyzer.service.CompanyService;
import jakarta.validation.constraints.*;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/companies")
@Validated
public class CompanyController {
    private final CompanyService service;

    public CompanyController(CompanyService service) { this.service = service; }

    @GetMapping
    public List<CompanySummary> search(@RequestParam(defaultValue = "") @Size(max = 40) String q) {
        return service.search(q);
    }

    @GetMapping("/{symbol}")
    public CompanySummary get(@PathVariable @Pattern(regexp = "[A-Za-z0-9&-]{1,20}") String symbol) {
        return service.get(symbol);
    }

    @GetMapping("/{symbol}/prices")
    public List<Candle> prices(@PathVariable @Pattern(regexp = "[A-Za-z0-9&-]{1,20}") String symbol,
                               @RequestParam(defaultValue = "90") @Min(5) @Max(365) int days) {
        return service.prices(symbol, days);
    }
}
