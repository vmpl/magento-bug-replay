<?php declare(strict_types=1);

namespace VMPL\BugReplay\ViewModel\Adminhtml;

use Magento\Framework\DataObject;
use Magento\Framework\UrlInterface;
use Magento\Framework\View\Element\Block\ArgumentInterface;
use VMPL\BugReplay\Model\StoreConfigProvider;
use VMPL\BugReplay\Types\StoreConfig;

/**
 * @method self setHash(string $hash)
 */
class Session extends \VMPL\BugReplay\ViewModel\Session implements ArgumentInterface
{
    public function __construct(
        protected readonly UrlInterface $urlBuilder,
        StoreConfigProvider $configProvider,
        array $data = [],
    ) {
        parent::__construct($configProvider, $data);
    }

    final public function getHash(): string
    {
        return $this->getData('hash') ?? 'AdminReplay';
    }

    final public function getFileRequestUrl(): string
    {
        return $this->urlBuilder->getUrl(
            'vmpl_bug_replay/session/download',
            ['hash' => $this->getHash()],
        );
    }

    final public function endpointRequest(): string
    {
        $url = $this->urlBuilder->getUrl(
            'vmpl_bug_replay/worker/loader',
        );
        return $url;
    }

    public function getAdminhtmlConfig(): array
    {
        return array_map(
            fn ($case) => $this->configProvider->getValue($case),
            StoreConfig::getGroupCases('admin'),
        );
    }
}
