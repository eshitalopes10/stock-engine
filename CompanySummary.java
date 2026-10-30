package com.stockanalyzer.dto;

import java.util.List;

public record CompanySummary(CompanyProfile profile, Quote quote, List<Double> spark) {}
