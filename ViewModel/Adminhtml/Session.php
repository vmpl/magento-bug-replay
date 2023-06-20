<?php declare(strict_types=1);

namespace VMPL\BugReplay\ViewModel\Adminhtml;

use Magento\Framework\DataObject;
use Magento\Framework\UrlInterface;
use Magento\Framework\View\Element\Block\ArgumentInterface;

/**
 * @method self setHash(string $hash)
 */
class Session extends DataObject implements ArgumentInterface
{
    public function __construct(
        protected readonly UrlInterface $urlBuilder,
        array $data = [],
    ) {
        parent::__construct($data);
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
}
