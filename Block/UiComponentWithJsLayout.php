<?php declare(strict_types=1);

namespace VMPL\BugReplay\Block;

use Magento\Framework\Serialize\SerializerInterface;
use Magento\Framework\View\Element\Template;

class UiComponentWithJsLayout extends Template
{
    public function __construct(
        Template\Context $context,
        protected readonly SerializerInterface $serializer,
        array            $data = [],
    ) {
        parent::__construct($context, $data);
    }

    public function getJsLayout()
    {
        $components = [];
        $groupName = $this->getData('group_name') ?? 'ui_components';
        $childNames = $this->getGroupChildNames($groupName);
        foreach ($childNames as $componentName) {
            $jsLayout = (function ($childHtml) {
                $document = new \DOMDocument();
                $document->loadHTML($childHtml);
                $node = $document->getElementsByTagName('script')->item(0);
                $textContent = $node->textContent;
                return $this->serializer->unserialize($textContent);
            })($this->getChildHtml($componentName));
            $components[] = $jsLayout["*"]["Magento_Ui/js/core/app"]["components"];
        }
        $components = array_merge(...$components);

        $jsLayout = parent::getJsLayout();
        $jsLayout = json_decode($jsLayout, true);
        $jsLayout['components'] += $components;
        return json_encode($jsLayout);
    }
}
