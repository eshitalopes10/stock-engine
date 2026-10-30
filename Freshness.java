package com.stockanalyzer.dto;

/** How trustworthy/fresh a data point is. Never label data LIVE unless the provider verified it. */
public enum Freshness { LIVE, DELAYED, HISTORICAL, CACHED, SAMPLE, UNAVAILABLE }
