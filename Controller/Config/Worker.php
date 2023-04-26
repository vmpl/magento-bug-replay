<?php declare(strict_types=1);

namespace VMPL\BugReplay\Controller\Config;

use Magento\Framework\App\Action\HttpGetActionInterface;
use Magento\Framework\Controller\ResultFactory;
use Magento\Framework\UrlInterface;
use Magento\Framework\View\Asset\Repository as AssetRepository;

class Worker implements HttpGetActionInterface
{
    public function __construct(
        protected readonly ResultFactory   $resultFactory,
        protected readonly AssetRepository $assetRepository,
    ) {
    }

    public function execute()
    {
        $resultJson = $this->resultFactory->create(ResultFactory::TYPE_JSON);
        return $resultJson->setData([
            'assetUrl' => [
                'dexie' => $this->assetRepository->getUrl('VMPL_BugReplay/js/lib/dexie.js'),
            ],
        ]);
    }
}
