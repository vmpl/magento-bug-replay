<?php declare(strict_types=1);

namespace VMPL\BugReplay\Plugin;

use Magento\Cms\Model\Page\CustomLayout\Data\CustomLayoutSelectedInterface;
use Magento\Framework\App\ActionInterface;
use Magento\Framework\View\Result\Page as View;
use VMPL\BugReplay\Model\StoreConfigProvider;
use VMPL\BugReplay\Types\StoreConfig;

/**
 * @see \Magento\Cms\Helper\Page::prepareResultPage
 */
final class AppendPrivacyPolicyPageHandler
{
    public function __construct(
        private readonly StoreConfigProvider $configProvider,
        private readonly \Magento\Cms\Model\Page\IdentityMap $identityMap,
    ) {
    }

    /**
     * @param \Magento\Cms\Model\Page\CustomLayoutManagerInterface $subject
     * @return array
     */
    public function beforeApplyUpdate($subject, View $layout, CustomLayoutSelectedInterface $layoutSelected)
    {
        $page = $this->identityMap->get((int)$layoutSelected->getPageId());

        $storeConfigIdentifier = (string)$this->configProvider->getValue(StoreConfig::CmsPolicyPage);
        $storeConfigIdentifier = explode('|', $storeConfigIdentifier, 1);
        if (empty($storeConfigIdentifier)) {
            return [$layout, $layoutSelected];
        }

        if (($identifier = array_shift($storeConfigIdentifier))) {
            if ($page->getIdentifier() !== $identifier) {
                return [$layout, $layoutSelected];
            }
        }

        if (($storeModelId = array_shift($storeConfigIdentifier))) {
            if ($page->getId() !== $storeModelId) {
                return [$layout, $layoutSelected];
            }
        }

        $layout->addHandle('vmpl_bug_replay_policy_toggles');
        return [$layout, $layoutSelected];
    }

    public function aroundGetFor($subject, $proceed, int $pageId)
    {
        try {
            return $proceed($pageId);
        } catch (\Magento\Framework\Exception\NoSuchEntityException $exception) {
            return new \Magento\Cms\Model\Page\CustomLayout\Data\CustomLayoutSelected($pageId, 'default');
        }
    }
}
