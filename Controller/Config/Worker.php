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
        protected readonly UrlInterface    $url,
        protected readonly AssetRepository $assetRepository,
    ) {
    }

    public function execute()
    {
        $resultJson = $this->resultFactory->create(ResultFactory::TYPE_JSON);
        return $resultJson->setData([
            'baseJsUrl' => $this->url->getBaseUrl(['_type' => UrlInterface::URL_TYPE_STATIC]),
            'assetUrl' => [
                'require' => $this->assetRepository->createAsset('requirejs/require.js')->getUrl(),
                'require_mixin' => $this->assetRepository->createAsset('mage/requirejs/mixin.js')->getUrl(),
                'require_config' => $this->assetRepository->createAsset('requirejs-config.js')->getUrl(),
            ]
        ]);
    }
}
