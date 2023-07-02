<?php declare(strict_types=1);

namespace VMPL\BugReplay\Setup\Patch\Data;

use Magento\Cms\Api\Data\PageInterface;
use Magento\Cms\Api\Data\PageInterfaceFactory;
use Magento\Cms\Api\PageRepositoryInterface;
use Magento\Framework\Setup\ModuleDataSetupInterface;
use Magento\Framework\Setup\Patch\DataPatchInterface;

final class CreatePrivacyPolicyEmptyPage implements DataPatchInterface
{
    public function __construct(
        private readonly ModuleDataSetupInterface $setup,
        private readonly PageInterfaceFactory $pageFactory,
        private readonly PageRepositoryInterface $pageRepository,
    ) {
    }

    public static function getDependencies()
    {
        return [];
    }

    public function getAliases()
    {
        return [];
    }

    public function apply()
    {
        $this->setup->startSetup();

        $content = <<<HTML
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
HTML;

        $page = $this->pageFactory->create(['data' => [
            PageInterface::TITLE => 'Record Policy',
            PageInterface::IS_ACTIVE => 0,
            PageInterface::PAGE_LAYOUT => 'cms-full-width',
            PageInterface::IDENTIFIER => 'record-policy-page',
            PageInterface::CONTENT => $content,
        ]]);
        $page->setStore([0]);
        $page->setStores([0]);
        $this->pageRepository->save($page);

        $this->setup->endSetup();
    }
}
