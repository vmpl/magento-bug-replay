<?php declare(strict_types=1);

namespace VMPL\BugReplay\Types;

enum StoreConfig : string
{
    case AdminAvailable = 'analytics/vmpl_bug_replay/admin/available';
    case Available = 'analytics/vmpl_bug_replay/storefront/available';
    case EnabledByDefault = 'analytics/vmpl_bug_replay/storefront/enabled';
    case EnableToggle = 'analytics/vmpl_bug_replay/storefront/enable_toggle';
    case AutoReport = 'analytics/vmpl_bug_replay/storefront/report';
    case AutoReportToggle = 'analytics/vmpl_bug_replay/storefront/report_toggle';
    case CmsPolicyPage = 'analytics/vmpl_bug_replay/storefront/policy_page';

    /**
     * @return array<string, self>
     */
    static function getGroupCases(string $byGroup)
    {
        $cases = array_map(function ($case) use ($byGroup) {
            $configPathComponents = explode('/', $case->value);
            $field = array_pop($configPathComponents);
            $group = array_pop($configPathComponents);

            return $group === $byGroup
                ? [$field, $case]
                : null;
        }, static::cases());
        $cases = array_filter($cases);
        return array_column($cases, 1, 0);
    }
}
