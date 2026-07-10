// Core matching + ranking logic. Pure functions, no AI here —
// this is the deterministic, judge-proof layer.
// Produces two tiers: "confirmed" matches and "possible" matches
// (where a "Not Sure" answer meant we couldn't rule it out either).

function checkIncome(scheme, profile) {
  const maxIncome = scheme.eligibility.maxIncome;
  if (maxIncome === null || maxIncome === undefined) return "pass";
  if (profile.incomeUnknown) return "unsure";
  if (profile.income === null || profile.income === undefined) return "unsure";
  return profile.income <= maxIncome ? "pass" : "fail";
}

function checkDisability(scheme, profile) {
  if (!scheme.eligibility.disabilityRequired) return "pass";
  if (profile.hasDisability === "yes") return "pass";
  if (profile.hasDisability === "not_sure") return "unsure";
  return "fail";
}

function checkListField(requiredList, userValue) {
  if (!requiredList || requiredList.length === 0) return "pass";
  if (!userValue) return "unsure";
  return requiredList.includes(userValue) ? "pass" : "fail";
}

function evaluateScheme(scheme, profile) {
  const e = scheme.eligibility;
  const checks = [];

  if (profile.age < e.minAge || profile.age > e.maxAge) return "fail";
  if (e.gender !== "any" && profile.gender !== e.gender) return "fail";

  checks.push(checkIncome(scheme, profile));
  checks.push(checkDisability(scheme, profile));
  checks.push(checkListField(e.occupation, profile.occupation));
  checks.push(checkListField(e.maritalStatus, profile.maritalStatus));
  checks.push(checkListField(e.states, profile.state));
  checks.push(checkListField(e.socialCategory, profile.socialCategory));

  if (checks.includes("fail")) return "fail";
  if (checks.includes("unsure")) return "possible";
  return "confirmed";
}

function normalize(value, min, max) {
  if (max === min) return 50;
  return ((value - min) / (max - min)) * 100;
}

function daysUntil(date) {
  if (!date) return null;
  const diff = new Date(date).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function scoreSchemes(schemesWithTier) {
  if (schemesWithTier.length === 0) return [];

  const benefitValues = schemesWithTier.map(s => s.scheme.benefitAmount || 0);
  const maxBenefit = Math.max(...benefitValues, 1);
  const minBenefit = Math.min(...benefitValues, 0);

  return schemesWithTier.map(({ scheme, tier }) => {
    const days = daysUntil(scheme.deadline);
    let urgency = 20;
    if (days !== null) {
      urgency = days <= 0 ? 0 : Math.max(0, 100 - days);
    }

    const value = normalize(scheme.benefitAmount || 0, minBenefit, maxBenefit);

    const complexity = (scheme.numDocuments || 0) * 8 + (scheme.numSteps || 0) * 6 +
      (scheme.applyMode === "offline" ? 15 : 0);
    const ease = Math.max(0, 100 - complexity);

    const prereqBonus = (scheme.isPrerequisiteFor && scheme.isPrerequisiteFor.length > 0) ? 15 : 0;
    const tierPenalty = tier === "possible" ? 10 : 0;

    const priorityScore = Math.round(
      urgency * 0.30 + value * 0.30 + ease * 0.25 + prereqBonus - tierPenalty
    );

    return {
      ...(scheme.toObject ? scheme.toObject() : scheme),
      matchTier: tier,
      matchInsights: {
        urgencyScore: Math.round(urgency),
        valueScore: Math.round(value),
        easeScore: Math.round(ease),
        prereqBonus,
        priorityScore,
        daysUntilDeadline: days
      }
    };
  }).sort((a, b) => b.matchInsights.priorityScore - a.matchInsights.priorityScore);
}

function matchAndRank(allSchemes, profile) {
  const withTier = allSchemes
    .map(scheme => ({ scheme, tier: evaluateScheme(scheme, profile) }))
    .filter(({ tier }) => tier !== "fail");

  return scoreSchemes(withTier);
}

module.exports = { evaluateScheme, matchAndRank, scoreSchemes };
