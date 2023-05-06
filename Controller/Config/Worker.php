<?php declare(strict_types=1);

namespace VMPL\BugReplay\Controller\Config;

use Magento\Framework\App\Action\HttpGetActionInterface;
use Magento\Framework\Controller\ResultFactory;
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
            'baseUrl' => $this->assetRepository->getUrl(''),
            'assetUrl' => [
                'sessionLoader' => $this->assetRepository->getUrl('VMPL_BugReplay/js/worker/session-loader.js'),
                'requireWorker' => $this->assetRepository->getUrl('VMPL_BugReplay/js/worker/requirejs-plugin.js'),
                'requirejs' => $this->assetRepository->getUrl('requirejs/require.js'),
                'requireMixins' => $this->assetRepository->getUrl('mage/requirejs/mixins.js'),
                'requireConfig' => $this->assetRepository->getUrl('requirejs-config.js'),
            ],
        ]);
    }
}
